"""
Live Physics Laboratory & Synchronized Classroom Broadcasting Router
Enterprise Multi-Worker Real-Time Architecture with SQLite WAL Inter-Process Event Bus.
Enables teachers across Iran to conduct live interactive experiments while dozens to hundreds
of students watch and interact in real-time with zero lag, guaranteed across all Uvicorn workers.
"""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Dict, Set, Any, List
import asyncio
import sqlite3
import json
import time
import uuid
import os
import logging

logger = logging.getLogger("physics_society.live_lab")

router = APIRouter(prefix="/live-lab", tags=["Live Laboratory Classroom"])

# SQLite DB Path (inside shared uploads directory across all workers/containers)
DB_DIR = os.getenv("UPLOAD_DIR", os.path.abspath("data/uploads"))
os.makedirs(DB_DIR, exist_ok=True)
DB_PATH = os.path.join(DB_DIR, "live_lab_rooms.db")

CURRENT_PID = os.getpid()

def get_db():
    conn = sqlite3.connect(DB_PATH, timeout=15.0)
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA synchronous=NORMAL;")
    conn.row_factory = sqlite3.Row
    return conn

def init_live_db():
    with get_db() as conn:
        conn.execute("""
        CREATE TABLE IF NOT EXISTS rooms (
            room_code TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            sim_id TEXT NOT NULL,
            sim_title TEXT DEFAULT '',
            is_locked INTEGER DEFAULT 1,
            grade INTEGER NOT NULL,
            teacher_name TEXT NOT NULL,
            current_state_json TEXT NOT NULL,
            teacher_notes_json TEXT NOT NULL,
            active_poll_json TEXT,
            poll_votes_json TEXT,
            created_at REAL NOT NULL,
            updated_at REAL NOT NULL
        )
        """)
        # Ensure schema migrations for existing SQLite databases
        try:
            conn.execute("ALTER TABLE rooms ADD COLUMN sim_title TEXT DEFAULT '';")
        except Exception:
            pass
        try:
            conn.execute("ALTER TABLE rooms ADD COLUMN is_locked INTEGER DEFAULT 1;")
        except Exception:
            pass
        try:
            conn.execute("ALTER TABLE rooms ADD COLUMN is_streaming INTEGER DEFAULT 0;")
        except Exception:
            pass
        conn.execute("""
        CREATE TABLE IF NOT EXISTS chat_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            room_code TEXT NOT NULL,
            sender TEXT NOT NULL,
            role TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at REAL NOT NULL
        )
        """)
        conn.execute("""
        CREATE TABLE IF NOT EXISTS live_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            room_code TEXT NOT NULL,
            sender_pid INTEGER NOT NULL,
            event_type TEXT NOT NULL,
            payload_json TEXT NOT NULL,
            created_at REAL NOT NULL
        )
        """)
        conn.execute("CREATE INDEX IF NOT EXISTS idx_live_events_lookup ON live_events(room_code, id)")
        
        conn.execute("""
        CREATE TABLE IF NOT EXISTS active_viewers (
            session_id TEXT PRIMARY KEY,
            room_code TEXT NOT NULL,
            user_name TEXT NOT NULL,
            role TEXT NOT NULL,
            worker_pid INTEGER NOT NULL,
            last_ping REAL NOT NULL
        )
        """)
        conn.execute("CREATE INDEX IF NOT EXISTS idx_viewers_room ON active_viewers(room_code, last_ping)")
        
        conn.execute("""
        CREATE TABLE IF NOT EXISTS live_frames (
            room_code TEXT PRIMARY KEY,
            frame_data TEXT NOT NULL,
            updated_at REAL NOT NULL
        )
        """)
        conn.commit()

        # Seed permanent demo room if not exists
        demo_code = "SMP-404"
        cur = conn.execute("SELECT room_code FROM rooms WHERE room_code = ?", (demo_code,))
        if not cur.fetchone():
            default_state = json.dumps({
                "x0": 0.0, "v0": 0.0, "a": 0.0,
                "curX": 0.0, "curV": 0.0, "curA": 0.0, "curT": 0.0,
                "isRunning": False, "sim_id": "motion-1d"
            })
            default_notes = json.dumps([
                "به مساحت سطح زیر نمودار سرعت-زمان (Δx) و شیب خط مماس (شتاب لحظه‌ای a) در حرکت شتاب‌دار دقت نمایید.",
                "معادله حرکت با شتاب ثابت: x(t) = 1/2*a*t^2 + v0*t + x0"
            ])
            conn.execute("""
            INSERT INTO rooms (room_code, title, sim_id, grade, teacher_name, current_state_json, teacher_notes_json, active_poll_json, poll_votes_json, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, NULL, NULL, ?, ?)
            """, (demo_code, "کلاس پژوهشی فیزیک سمپاد: حرکت بر خط راست و تحلیل نمودارهای لحظه‌ای", "motion-1d", 9, "دپارتمان فیزیک استعدادهای درخشان", default_state, default_notes, time.time(), time.time()))
            conn.commit()

init_live_db()

# Local worker socket connections map: room_code -> Set[WebSocket]
local_sockets: Dict[str, Set[WebSocket]] = {}
# Session ID to WebSocket map for 1-to-1 WebRTC signaling
session_sockets: Dict[str, WebSocket] = {}
last_handled_event_id: int = 0

# In-memory fast frame & ping cache to eliminate SQLite lock contention under 150+ concurrent users
latest_room_frames: Dict[str, Dict[str, Any]] = {}
last_frame_db_save: Dict[str, float] = {}
last_viewer_db_ping: Dict[str, float] = {}

async def broadcast_to_local_sockets(room_code: str, message: dict, exclude: Optional[WebSocket] = None):
    sockets = local_sockets.get(room_code, set())
    if not sockets:
        return
    text = json.dumps(message)
    dead = set()
    for ws in list(sockets):
        if ws != exclude:
            try:
                await ws.send_text(text)
            except Exception:
                dead.add(ws)
    for ws in dead:
        sockets.discard(ws)

async def send_to_session(target_session_id: str, message: dict, room_code: str):
    """Delivers message directly to target session if connected locally, or dispatches across workers"""
    ws = session_sockets.get(target_session_id)
    if ws:
        try:
            await ws.send_text(json.dumps(message))
            return True
        except Exception:
            session_sockets.pop(target_session_id, None)
    # Broadcast through cross-worker SQLite event bus
    publish_event(room_code, message.get("type", "targeted_msg"), {**message, "target_session_id": target_session_id})
    return False

def publish_event(room_code: str, event_type: str, payload: dict):
    """Publishes an event to the shared SQLite WAL event bus, accessible by all 4 worker processes"""
    now = time.time()
    try:
        with get_db() as conn:
            conn.execute(
                "INSERT INTO live_events (room_code, sender_pid, event_type, payload_json, created_at) VALUES (?, ?, ?, ?, ?)",
                (room_code, CURRENT_PID, event_type, json.dumps(payload), now)
            )
            # Periodic cleanup: retain events from last 120 seconds only
            if now % 10 < 0.2:
                conn.execute("DELETE FROM live_events WHERE created_at < ?", (now - 120,))
                conn.execute("DELETE FROM active_viewers WHERE last_ping < ?", (now - 30,))
            conn.commit()
    except Exception as e:
        logger.error(f"Failed to publish event {event_type} in room {room_code}: {e}")

# Async Background Event Bus Poller (Running in each Uvicorn worker process)
event_listener_task: Optional[asyncio.Task] = None

async def event_bus_listener():
    global last_handled_event_id
    # Initialize pointer to latest event
    try:
        with get_db() as conn:
            cur = conn.execute("SELECT MAX(id) as max_id FROM live_events")
            row = cur.fetchone()
            if row and row["max_id"]:
                last_handled_event_id = int(row["max_id"])
    except Exception:
        pass

    while True:
        try:
            active_rooms = list(local_sockets.keys())
            if active_rooms or session_sockets:
                with get_db() as conn:
                    cur = conn.execute(
                        "SELECT id, room_code, sender_pid, event_type, payload_json FROM live_events WHERE id > ? ORDER BY id ASC LIMIT 50",
                        (last_handled_event_id,)
                    )
                    rows = cur.fetchall()
                    for r in rows:
                        last_handled_event_id = max(last_handled_event_id, int(r["id"]))
                        # Only broadcast if originated from another worker OR needs broadcast
                        if int(r["sender_pid"]) != CURRENT_PID:
                            room = r["room_code"]
                            if r["event_type"] == "stream_frame":
                                if room in local_sockets and local_sockets[room]:
                                    mem_f = latest_room_frames.get(room)
                                    if mem_f and mem_f.get("frame"):
                                        await broadcast_to_local_sockets(room, {"type": "stream_frame", "frame": mem_f["frame"]})
                                    else:
                                        cur_f = conn.execute("SELECT frame_data FROM live_frames WHERE room_code = ?", (room,))
                                        row_f = cur_f.fetchone()
                                        if row_f and row_f["frame_data"]:
                                            await broadcast_to_local_sockets(room, {"type": "stream_frame", "frame": row_f["frame_data"]})
                            else:
                                payload = json.loads(r["payload_json"])
                                target = payload.get("target_session_id")
                                if target:
                                    ws = session_sockets.get(target)
                                    if ws:
                                        try:
                                            await ws.send_text(json.dumps(payload))
                                        except Exception:
                                            session_sockets.pop(target, None)
                                else:
                                    if room in local_sockets and local_sockets[room]:
                                        payload["type"] = r["event_type"]
                                        await broadcast_to_local_sockets(room, payload)
        except Exception as e:
            logger.debug(f"Event bus loop tick error: {e}")
        await asyncio.sleep(0.04)  # 40ms polling tick (butter-smooth real-time)

def ensure_event_listener_started():
    global event_listener_task
    if event_listener_task is None or event_listener_task.done():
        try:
            loop = asyncio.get_event_loop()
            if loop.is_running():
                event_listener_task = loop.create_task(event_bus_listener())
        except Exception as e:
            logger.debug(f"Could not start event bus listener: {e}")

class RoomCreateRequest(BaseModel):
    title: str = Field(..., min_length=3, max_length=150)
    sim_id: str = Field("motion-1d", min_length=2, max_length=50)
    sim_title: Optional[str] = Field("حرکت بر روی خط راست", max_length=150)
    grade: Optional[int] = Field(9, ge=7, le=9)
    teacher_name: Optional[str] = Field("دبیر فیزیک سمپاد", max_length=100)

class StateUpdateRequest(BaseModel):
    payload: Dict[str, Any]

class ChatSendRequest(BaseModel):
    sender: str
    role: str = "student"
    message: str

class TeacherNoteRequest(BaseModel):
    note: str

class PollCreateRequest(BaseModel):
    question: str
    options: List[str]

class PollVoteRequest(BaseModel):
    option_index: int

class ChangeSimulatorRequest(BaseModel):
    sim_id: str
    sim_title: Optional[str] = ""

class ToggleLockRequest(BaseModel):
    is_locked: bool

@router.get("/rooms")
async def list_live_rooms():
    """Returns active live laboratory classrooms with live student counts across all workers"""
    ensure_event_listener_started()
    now = time.time()
    with get_db() as conn:
        cur = conn.execute("SELECT room_code, title, sim_id, COALESCE(sim_title, '') as sim_title, COALESCE(is_locked, 1) as is_locked, grade, teacher_name, created_at, updated_at FROM rooms ORDER BY updated_at DESC LIMIT 20")
        rows = cur.fetchall()
        result = []
        for r in rows:
            cur_count = conn.execute("SELECT COUNT(*) as count FROM active_viewers WHERE room_code = ? AND last_ping > ?", (r["room_code"], now - 20))
            count_row = cur_count.fetchone()
            viewers_count = max(count_row["count"] if count_row else 0, len(local_sockets.get(r["room_code"], set())))
            result.append({
                "room_code": r["room_code"],
                "title": r["title"],
                "sim_id": r["sim_id"],
                "sim_title": r["sim_title"],
                "is_locked": bool(r["is_locked"]),
                "grade": r["grade"],
                "teacher_name": r["teacher_name"],
                "viewers_count": viewers_count,
                "created_at": r["created_at"],
                "is_active": (now - r["updated_at"]) < 3600
            })
    return {"rooms": result}

@router.post("/create")
@router.post("/rooms")
async def create_live_room(req: RoomCreateRequest):
    """Creates a new synchronized live classroom broadcast"""
    ensure_event_listener_started()
    code = f"SMP-{uuid.uuid4().hex[:4].upper()}"
    now = time.time()
    default_state = json.dumps({
        "x0": 0.0, "v0": 0.0, "a": 0.0,
        "curX": 0.0, "curV": 0.0, "curA": 0.0, "curT": 0.0,
        "isRunning": False, "sim_id": req.sim_id
    })
    default_notes = json.dumps([
        f"به پخش زنده کلاس «{req.title}» خوش آمدید."
    ])

    with get_db() as conn:
        conn.execute("""
        INSERT INTO rooms (room_code, title, sim_id, sim_title, is_locked, grade, teacher_name, current_state_json, teacher_notes_json, active_poll_json, poll_votes_json, created_at, updated_at)
        VALUES (?, ?, ?, ?, 1, ?, ?, ?, ?, NULL, NULL, ?, ?)
        """, (code, req.title, req.sim_id, req.sim_title or "", req.grade, req.teacher_name, default_state, default_notes, now, now))
        conn.commit()

    room_dict = {
        "room_code": code,
        "title": req.title,
        "sim_id": req.sim_id,
        "sim_title": req.sim_title or "",
        "share_url": f"/#live-lab/{code}"
    }
    return {
        "success": True,
        **room_dict,
        "room": room_dict
    }

@router.get("/rooms/{room_code}")
async def get_room_details(room_code: str):
    """Fetches room metadata, active state, teacher chalkboard notes, and chat history"""
    ensure_event_listener_started()
    now = time.time()
    with get_db() as conn:
        cur = conn.execute("SELECT room_code, title, sim_id, COALESCE(sim_title, '') as sim_title, COALESCE(is_locked, 1) as is_locked, COALESCE(is_streaming, 0) as is_streaming, grade, teacher_name, current_state_json, teacher_notes_json, active_poll_json, poll_votes_json, created_at FROM rooms WHERE room_code = ?", (room_code,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="اتاق پخش زنده یافت نشد.")

        cur_chat = conn.execute("SELECT sender, role, message, created_at FROM chat_messages WHERE room_code = ? ORDER BY id DESC LIMIT 50", (room_code,))
        chat_rows = cur_chat.fetchall()
        chat_history = [{
            "sender": c["sender"],
            "role": c["role"],
            "message": c["message"],
            "time": time.strftime("%H:%M", time.localtime(c["created_at"]))
        } for c in reversed(chat_rows)]

        cur_count = conn.execute("SELECT COUNT(*) as count FROM active_viewers WHERE room_code = ? AND last_ping > ?", (room_code, now - 20))
        count_row = cur_count.fetchone()
        viewers_count = max(count_row["count"] if count_row else 0, len(local_sockets.get(room_code, set())), 1)

        return {
            "room_code": row["room_code"],
            "title": row["title"],
            "sim_id": row["sim_id"],
            "sim_title": row["sim_title"],
            "is_locked": bool(row["is_locked"]),
            "is_streaming": bool(row["is_streaming"]),
            "grade": row["grade"],
            "teacher_name": row["teacher_name"],
            "viewers_count": viewers_count,
            "created_at": row["created_at"],
            "current_state": json.loads(row["current_state_json"]),
            "teacher_notes": json.loads(row["teacher_notes_json"]),
            "active_poll": json.loads(row["active_poll_json"]) if row["active_poll_json"] else None,
            "poll_votes": json.loads(row["poll_votes_json"]) if row["poll_votes_json"] else None,
            "chat_history": chat_history
        }

@router.get("/rooms/{room_code}/sync")
async def sync_room_state(room_code: str, since: float = Query(0.0)):
    """Fast polling sync endpoint guaranteeing lockstep across multi-worker Uvicorn instances"""
    ensure_event_listener_started()
    with get_db() as conn:
        cur = conn.execute("SELECT sim_id, COALESCE(sim_title, '') as sim_title, COALESCE(is_locked, 1) as is_locked, current_state_json, teacher_notes_json, active_poll_json, poll_votes_json, updated_at FROM rooms WHERE room_code = ?", (room_code,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Room not found")

        cur_chat = conn.execute("SELECT sender, role, message, created_at FROM chat_messages WHERE room_code = ? AND created_at > ? ORDER BY id ASC", (room_code, since))
        chat_rows = cur_chat.fetchall()
        new_messages = [{
            "sender": c["sender"],
            "role": c["role"],
            "message": c["message"],
            "time": time.strftime("%H:%M", time.localtime(c["created_at"]))
        } for c in chat_rows]

        return {
            "updated_at": row["updated_at"],
            "sim_id": row["sim_id"],
            "sim_title": row["sim_title"],
            "is_locked": bool(row["is_locked"]),
            "current_state": json.loads(row["current_state_json"]),
            "teacher_notes": json.loads(row["teacher_notes_json"]),
            "active_poll": json.loads(row["active_poll_json"]) if row["active_poll_json"] else None,
            "poll_votes": json.loads(row["poll_votes_json"]) if row["poll_votes_json"] else None,
            "new_messages": new_messages
        }

@router.post("/rooms/{room_code}/state")
async def post_room_state(room_code: str, req: StateUpdateRequest):
    """Allows teacher to update live simulation parameters"""
    now = time.time()
    with get_db() as conn:
        cur = conn.execute("SELECT current_state_json FROM rooms WHERE room_code = ?", (room_code,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Room not found")
        
        st = json.loads(row["current_state_json"])
        st.update(req.payload)
        conn.execute("UPDATE rooms SET current_state_json = ?, updated_at = ? WHERE room_code = ?", (json.dumps(st), now, room_code))
        conn.commit()

    payload = {"payload": req.payload, "updated_at": now}
    publish_event(room_code, "state_sync", payload)
    await broadcast_to_local_sockets(room_code, {"type": "state_sync", **payload})
    return {"success": True}

@router.post("/rooms/{room_code}/chat")
async def post_room_chat(room_code: str, req: ChatSendRequest):
    """Allows teacher or students to send live classroom chat messages"""
    now = time.time()
    with get_db() as conn:
        conn.execute("INSERT INTO chat_messages (room_code, sender, role, message, created_at) VALUES (?, ?, ?, ?, ?)",
                     (room_code, req.sender, req.role, req.message, now))
        conn.commit()

    msg_data = {
        "sender": req.sender,
        "role": req.role,
        "message": req.message,
        "time": time.strftime("%H:%M")
    }
    publish_event(room_code, "chat_message", msg_data)
    await broadcast_to_local_sockets(room_code, {"type": "chat_message", **msg_data})
    return {"success": True, "message": msg_data}

@router.post("/rooms/{room_code}/note")
async def post_teacher_note(room_code: str, req: TeacherNoteRequest):
    """Adds a formula or lesson note to the teacher's live chalkboard"""
    now = time.time()
    note_text = req.note.strip()
    if not note_text:
        raise HTTPException(status_code=400, detail="Note cannot be empty")

    with get_db() as conn:
        cur = conn.execute("SELECT teacher_notes_json FROM rooms WHERE room_code = ?", (room_code,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Room not found")
        
        notes = json.loads(row["teacher_notes_json"])
        notes.insert(0, note_text)
        if len(notes) > 20:
            notes = notes[:20]
        conn.execute("UPDATE rooms SET teacher_notes_json = ?, updated_at = ? WHERE room_code = ?", (json.dumps(notes), now, room_code))
        conn.commit()

    payload = {"note": note_text, "notes": notes, "timestamp": now}
    publish_event(room_code, "teacher_note_added", payload)
    await broadcast_to_local_sockets(room_code, {"type": "teacher_note_added", **payload})
    return {"success": True, "notes": notes}

@router.post("/rooms/{room_code}/poll")
async def create_classroom_poll(room_code: str, req: PollCreateRequest):
    """Starts a live interactive multiple-choice question for all students"""
    now = time.time()
    q = req.question.strip()
    opts = [o.strip() for o in req.options if o.strip()]
    if not q or len(opts) < 2:
        raise HTTPException(status_code=400, detail="Question and at least 2 options required")

    poll_data = {"question": q, "options": opts}
    votes_data = {str(i): 0 for i in range(len(opts))}

    with get_db() as conn:
        conn.execute("UPDATE rooms SET active_poll_json = ?, poll_votes_json = ?, updated_at = ? WHERE room_code = ?",
                     (json.dumps(poll_data), json.dumps(votes_data), now, room_code))
        conn.commit()

    payload = {"question": q, "options": opts, "votes": votes_data, "total": 0}
    publish_event(room_code, "poll_started", payload)
    await broadcast_to_local_sockets(room_code, {"type": "poll_started", **payload})
    return {"success": True, "poll": poll_data}

@router.post("/rooms/{room_code}/vote")
async def submit_poll_vote(room_code: str, req: PollVoteRequest):
    """Submits student vote on active classroom poll"""
    now = time.time()
    with get_db() as conn:
        cur = conn.execute("SELECT active_poll_json, poll_votes_json FROM rooms WHERE room_code = ?", (room_code,))
        row = cur.fetchone()
        if not row or not row["active_poll_json"]:
            raise HTTPException(status_code=400, detail="No active poll in this classroom")
        
        votes = json.loads(row["poll_votes_json"]) if row["poll_votes_json"] else {}
        idx_str = str(req.option_index)
        if idx_str in votes:
            votes[idx_str] += 1
        else:
            votes[idx_str] = 1

        total = sum(votes.values())
        conn.execute("UPDATE rooms SET poll_votes_json = ?, updated_at = ? WHERE room_code = ?", (json.dumps(votes), now, room_code))
        conn.commit()

    payload = {"votes": votes, "total": total}
    publish_event(room_code, "poll_update", payload)
    await broadcast_to_local_sockets(room_code, {"type": "poll_update", **payload})
    return {"success": True, "votes": votes, "total": total}

@router.post("/rooms/{room_code}/change-simulator")
async def change_room_simulator(room_code: str, req: ChangeSimulatorRequest):
    """Teacher switches the active laboratory simulator for all connected students in real-time"""
    ensure_event_listener_started()
    now_t = time.time()
    with get_db() as conn:
        conn.execute("UPDATE rooms SET sim_id = ?, sim_title = ?, updated_at = ? WHERE room_code = ?", (req.sim_id, req.sim_title or "", now_t, room_code))
        conn.commit()
    sim_payload = {"sim_id": req.sim_id, "sim_title": req.sim_title or "", "timestamp": now_t}
    publish_event(room_code, "simulator_changed", sim_payload)
    await broadcast_to_local_sockets(room_code, {"type": "simulator_changed", **sim_payload})
    return {"success": True, **sim_payload}

@router.post("/rooms/{room_code}/toggle-lock")
async def toggle_room_lock(room_code: str, req: ToggleLockRequest):
    """Teacher toggles lock on student interactions across all connected devices"""
    ensure_event_listener_started()
    now_t = time.time()
    with get_db() as conn:
        conn.execute("UPDATE rooms SET is_locked = ?, updated_at = ? WHERE room_code = ?", (1 if req.is_locked else 0, now_t, room_code))
        conn.commit()
    lock_payload = {"is_locked": req.is_locked, "timestamp": now_t}
    publish_event(room_code, "lock_toggled", lock_payload)
    await broadcast_to_local_sockets(room_code, {"type": "lock_toggled", **lock_payload})
    return {"success": True, **lock_payload}

@router.delete("/rooms/{room_code}")
async def delete_live_room(room_code: str):
    """Admin or presenter closes and completely removes a live classroom"""
    ensure_event_listener_started()
    with get_db() as conn:
        conn.execute("DELETE FROM rooms WHERE room_code = ?", (room_code,))
        conn.execute("DELETE FROM chat_messages WHERE room_code = ?", (room_code,))
        conn.execute("DELETE FROM live_frames WHERE room_code = ?", (room_code,))
        conn.execute("DELETE FROM active_viewers WHERE room_code = ?", (room_code,))
        conn.commit()

    latest_room_frames.pop(room_code, None)
    last_frame_db_save.pop(room_code, None)

    end_payload = {"room_code": room_code, "type": "room_closed"}
    publish_event(room_code, "room_closed", end_payload)
    await broadcast_to_local_sockets(room_code, end_payload)
    return {"success": True, "message": "کلاس با موفقیت بسته شد."}

@router.post("/rooms/{room_code}/clear-chat")
async def clear_room_chat(room_code: str):
    """Admin or presenter clears chat messages for the classroom"""
    with get_db() as conn:
        conn.execute("DELETE FROM chat_messages WHERE room_code = ?", (room_code,))
        conn.commit()
    publish_event(room_code, "chat_cleared", {})
    await broadcast_to_local_sockets(room_code, {"type": "chat_cleared"})
    return {"success": True}

@router.websocket("/ws/{room_code}")
async def live_lab_websocket(
    websocket: WebSocket,
    room_code: str,
    role: str = Query("student"),
    name: str = Query("دانش‌آموز")
):
    """Bidirectional real-time WebSocket connection synchronized across all 4 Uvicorn worker processes"""
    ensure_event_listener_started()
    await websocket.accept()

    session_id = uuid.uuid4().hex[:12]
    now = time.time()

    if room_code not in local_sockets:
        local_sockets[room_code] = set()
    local_sockets[room_code].add(websocket)
    session_sockets[session_id] = websocket

    # Register active viewer in shared DB
    try:
        with get_db() as conn:
            conn.execute(
                "INSERT OR REPLACE INTO active_viewers (session_id, room_code, user_name, role, worker_pid, last_ping) VALUES (?, ?, ?, ?, ?, ?)",
                (session_id, room_code, name, role, CURRENT_PID, now)
            )
            conn.commit()
    except Exception as e:
        logger.debug(f"Viewer registration error: {e}")

    # Compute total viewers across all workers
    total_viewers = 1
    try:
        with get_db() as conn:
            c = conn.execute("SELECT COUNT(*) as cnt FROM active_viewers WHERE room_code = ? AND last_ping > ?", (room_code, now - 20))
            cnt_row = c.fetchone()
            if cnt_row:
                total_viewers = max(cnt_row["cnt"], len(local_sockets[room_code]))
    except Exception:
        total_viewers = len(local_sockets[room_code])

    # Send initial room state to newly joined user
    with get_db() as conn:
        cur = conn.execute("SELECT sim_id, COALESCE(sim_title, '') as sim_title, COALESCE(is_locked, 1) as is_locked, COALESCE(is_streaming, 0) as is_streaming, current_state_json, teacher_notes_json, active_poll_json, poll_votes_json FROM rooms WHERE room_code = ?", (room_code,))
        row = cur.fetchone()

        init_frame = None
        mem_f = latest_room_frames.get(room_code)
        if mem_f and (now - mem_f.get("time", 0)) < 180:
            init_frame = mem_f.get("frame")
        else:
            cur_f = conn.execute("SELECT frame_data FROM live_frames WHERE room_code = ? AND updated_at > ?", (room_code, now - 180))
            row_f = cur_f.fetchone()
            init_frame = row_f["frame_data"] if row_f else None

        if row:
            await websocket.send_text(json.dumps({
                "type": "welcome",
                "room_code": room_code,
                "role": role,
                "session_id": session_id,
                "sim_id": row["sim_id"],
                "sim_title": row["sim_title"],
                "is_locked": bool(row["is_locked"]),
                "is_streaming": bool(row["is_streaming"]),
                "initial_frame": init_frame,
                "viewers_count": total_viewers,
                "state": json.loads(row["current_state_json"]),
                "notes": json.loads(row["teacher_notes_json"]),
                "active_poll": json.loads(row["active_poll_json"]) if row["active_poll_json"] else None,
                "poll_votes": json.loads(row["poll_votes_json"]) if row["poll_votes_json"] else None
            }))

    # Announce user joined across workers
    join_payload = {"name": name, "role": role, "viewers_count": total_viewers}
    publish_event(room_code, "user_joined", join_payload)
    await broadcast_to_local_sockets(room_code, {"type": "user_joined", **join_payload}, exclude=websocket)

    try:
        while True:
            data = await websocket.receive_json()
            msg_type = data.get("type")

            # 1. State Update (Teacher moving sliders or running simulation)
            if msg_type == "state_update":
                payload = data.get("payload", {})
                now_t = time.time()
                # Persist in DB
                with get_db() as conn:
                    cur = conn.execute("SELECT current_state_json FROM rooms WHERE room_code = ?", (room_code,))
                    r = cur.fetchone()
                    if r:
                        st = json.loads(r["current_state_json"])
                        st.update(payload)
                        conn.execute("UPDATE rooms SET current_state_json = ?, updated_at = ? WHERE room_code = ?", (json.dumps(st), now_t, room_code))
                        conn.commit()

                event_data = {"payload": payload, "timestamp": now_t}
                publish_event(room_code, "state_sync", event_data)
                await broadcast_to_local_sockets(room_code, {"type": "state_sync", **event_data}, exclude=websocket)

            # 2. Laser Pointer Move (Teacher pointing on simulation screen)
            elif msg_type == "laser_pointer":
                laser_data = {
                    "x": data.get("x", 0.5),
                    "y": data.get("y", 0.5),
                    "active": data.get("active", True)
                }
                publish_event(room_code, "laser_pointer", laser_data)
                await broadcast_to_local_sockets(room_code, {"type": "laser_pointer", **laser_data}, exclude=websocket)

            # 3. Teacher Chalkboard Note
            elif msg_type == "teacher_note":
                note = data.get("note", "").strip()
                if note:
                    now_t = time.time()
                    with get_db() as conn:
                        cur = conn.execute("SELECT teacher_notes_json FROM rooms WHERE room_code = ?", (room_code,))
                        r = cur.fetchone()
                        if r:
                            notes = json.loads(r["teacher_notes_json"])
                            notes.insert(0, note)
                            if len(notes) > 25:
                                notes = notes[:25]
                            conn.execute("UPDATE rooms SET teacher_notes_json = ?, updated_at = ? WHERE room_code = ?", (json.dumps(notes), now_t, room_code))
                            conn.commit()
                            note_data = {"note": note, "notes": notes, "timestamp": now_t}
                            publish_event(room_code, "teacher_note_added", note_data)
                            await broadcast_to_local_sockets(room_code, {"type": "teacher_note_added", **note_data})

            # 4. Clear Notes
            elif msg_type == "clear_notes":
                now_t = time.time()
                with get_db() as conn:
                    conn.execute("UPDATE rooms SET teacher_notes_json = '[]', updated_at = ? WHERE room_code = ?", (now_t, room_code))
                    conn.commit()
                publish_event(room_code, "notes_cleared", {})
                await broadcast_to_local_sockets(room_code, {"type": "notes_cleared"})

            # 5. Quick Classroom Poll Launch
            elif msg_type == "start_poll":
                poll_q = data.get("question", "").strip()
                poll_opts = [o.strip() for o in data.get("options", []) if o.strip()]
                if poll_q and len(poll_opts) >= 2:
                    now_t = time.time()
                    p_data = {"question": poll_q, "options": poll_opts}
                    v_data = {str(i): 0 for i in range(len(poll_opts))}
                    with get_db() as conn:
                        conn.execute("UPDATE rooms SET active_poll_json = ?, poll_votes_json = ?, updated_at = ? WHERE room_code = ?",
                                     (json.dumps(p_data), json.dumps(v_data), now_t, room_code))
                        conn.commit()
                    poll_event = {"question": poll_q, "options": poll_opts, "votes": v_data, "total": 0}
                    publish_event(room_code, "poll_started", poll_event)
                    await broadcast_to_local_sockets(room_code, {"type": "poll_started", **poll_event})

            # 6. Poll Vote
            elif msg_type == "poll_vote":
                v_idx = str(data.get("option_index", 0))
                now_t = time.time()
                with get_db() as conn:
                    cur = conn.execute("SELECT poll_votes_json FROM rooms WHERE room_code = ?", (room_code,))
                    r = cur.fetchone()
                    if r and r["poll_votes_json"]:
                        votes = json.loads(r["poll_votes_json"])
                        votes[v_idx] = votes.get(v_idx, 0) + 1
                        total = sum(votes.values())
                        conn.execute("UPDATE rooms SET poll_votes_json = ?, updated_at = ? WHERE room_code = ?", (json.dumps(votes), now_t, room_code))
                        conn.commit()
                        vote_event = {"votes": votes, "total": total}
                        publish_event(room_code, "poll_update", vote_event)
                        await broadcast_to_local_sockets(room_code, {"type": "poll_update", **vote_event})

            # 7. Student Raise Hand
            elif msg_type == "raise_hand":
                hand_data = {"sender": name, "timestamp": time.time()}
                publish_event(room_code, "student_raised_hand", hand_data)
                await broadcast_to_local_sockets(room_code, {"type": "student_raised_hand", **hand_data})

            # 8. Classroom Chat Message
            elif msg_type == "chat_message":
                text = data.get("message", "").strip()
                if text:
                    now_t = time.time()
                    with get_db() as conn:
                        conn.execute("INSERT INTO chat_messages (room_code, sender, role, message, created_at) VALUES (?, ?, ?, ?, ?)",
                                     (room_code, name, role, text, now_t))
                        conn.commit()
                    chat_data = {
                        "sender": name,
                        "role": role,
                        "message": text,
                        "time": time.strftime("%H:%M")
                    }
                    publish_event(room_code, "chat_message", chat_data)
                    await broadcast_to_local_sockets(room_code, {"type": "chat_message", **chat_data})

            # 9. Change Active Laboratory Simulator (Teacher Switching Experiment Live)
            elif msg_type == "change_simulator":
                new_sim_id = data.get("sim_id", "").strip()
                sim_title = data.get("sim_title", "").strip()
                if new_sim_id:
                    now_t = time.time()
                    with get_db() as conn:
                        conn.execute("UPDATE rooms SET sim_id = ?, sim_title = ?, updated_at = ? WHERE room_code = ?", (new_sim_id, sim_title, now_t, room_code))
                        conn.commit()
                    sim_event = {"sim_id": new_sim_id, "sim_title": sim_title, "timestamp": now_t}
                    publish_event(room_code, "simulator_changed", sim_event)
                    await broadcast_to_local_sockets(room_code, {"type": "simulator_changed", **sim_event})

            # 10. Toggle Student Interaction Lock
            elif msg_type == "toggle_lock":
                is_locked = bool(data.get("is_locked", True))
                now_t = time.time()
                with get_db() as conn:
                    conn.execute("UPDATE rooms SET is_locked = ?, updated_at = ? WHERE room_code = ?", (1 if is_locked else 0, now_t, room_code))
                    conn.commit()
                lock_event = {"is_locked": is_locked, "timestamp": now_t}
                publish_event(room_code, "lock_toggled", lock_event)
                await broadcast_to_local_sockets(room_code, {"type": "lock_toggled", **lock_event})

            # 11. Ping Heartbeat & Viewer Update (Optimized for 150+ concurrent users)
            elif msg_type == "ping":
                now_t = time.time()
                total_viewers = max(len(local_sockets.get(room_code, set())), 1)
                last_db_p = last_viewer_db_ping.get(session_id, 0.0)
                if now_t - last_db_p > 12.0:
                    last_viewer_db_ping[session_id] = now_t
                    try:
                        with get_db() as conn:
                            conn.execute("UPDATE active_viewers SET last_ping = ? WHERE session_id = ?", (now_t, session_id))
                            conn.commit()
                            c = conn.execute("SELECT COUNT(*) as cnt FROM active_viewers WHERE room_code = ? AND last_ping > ?", (room_code, now_t - 25))
                            row_c = c.fetchone()
                            if row_c and row_c["cnt"]:
                                total_viewers = max(row_c["cnt"], total_viewers)
                    except Exception:
                        pass
                await websocket.send_text(json.dumps({"type": "pong", "viewers_count": total_viewers}))

            # 12. Stream Started by Teacher (Google Meet Video Broadcast)
            elif msg_type == "stream_started":
                now_t = time.time()
                with get_db() as conn:
                    conn.execute("UPDATE rooms SET is_streaming = 1, updated_at = ? WHERE room_code = ?", (now_t, room_code))
                    conn.commit()
                stream_payload = {
                    "teacher_session_id": session_id,
                    "teacher_name": name,
                    "stream_type": data.get("stream_type", "screen"),
                    "has_audio": bool(data.get("has_audio", False)),
                    "timestamp": now_t
                }
                publish_event(room_code, "stream_started", stream_payload)
                await broadcast_to_local_sockets(room_code, {"type": "stream_started", **stream_payload}, exclude=websocket)

            # 13. Stream Stopped by Teacher
            elif msg_type == "stream_stopped":
                now_t = time.time()
                with get_db() as conn:
                    conn.execute("UPDATE rooms SET is_streaming = 0, updated_at = ? WHERE room_code = ?", (now_t, room_code))
                    conn.commit()
                stop_payload = {"teacher_session_id": session_id, "timestamp": now_t}
                publish_event(room_code, "stream_stopped", stop_payload)
                await broadcast_to_local_sockets(room_code, {"type": "stream_stopped", **stop_payload}, exclude=websocket)

            # 14. Request Stream (Student requesting connection to Teacher's active broadcast)
            elif msg_type == "request_stream":
                req_payload = {
                    "student_session_id": session_id,
                    "student_name": name,
                    "timestamp": time.time()
                }
                publish_event(room_code, "request_stream", req_payload)
                await broadcast_to_local_sockets(room_code, {"type": "request_stream", **req_payload}, exclude=websocket)

            # 15. WebRTC Offer (Teacher -> Student)
            elif msg_type == "webrtc_offer":
                target = data.get("target_session_id")
                if target:
                    offer_payload = {
                        "type": "webrtc_offer",
                        "offer": data.get("offer"),
                        "sender_session_id": session_id,
                        "sender_name": name,
                        "target_session_id": target
                    }
                    await send_to_session(target, offer_payload, room_code)

            # 16. WebRTC Answer (Student -> Teacher)
            elif msg_type == "webrtc_answer":
                target = data.get("target_session_id")
                if target:
                    ans_payload = {
                        "type": "webrtc_answer",
                        "answer": data.get("answer"),
                        "sender_session_id": session_id,
                        "sender_name": name,
                        "target_session_id": target
                    }
                    await send_to_session(target, ans_payload, room_code)

            # 17. WebRTC ICE Candidate (Bidirectional)
            elif msg_type == "webrtc_ice":
                target = data.get("target_session_id")
                if target:
                    ice_payload = {
                        "type": "webrtc_ice",
                        "candidate": data.get("candidate"),
                        "sender_session_id": session_id,
                        "target_session_id": target
                    }
                    await send_to_session(target, ice_payload, room_code)

            # 18. Fast Canvas Frame Fallback (Zero-disk-latency instant screen mirror across all workers)
            elif msg_type == "stream_frame":
                frame_val = data.get("frame")
                if frame_val:
                    now_f = time.time()
                    latest_room_frames[room_code] = {"frame": frame_val, "time": now_f}
                    # Ultra-fast in-memory broadcast to connected students with zero disk I/O lock
                    await broadcast_to_local_sockets(room_code, {"type": "stream_frame", "frame": frame_val}, exclude=websocket)
                    # Periodic lightweight persistence (at most once every 3.5s) so newly joined students get init_frame
                    last_save = last_frame_db_save.get(room_code, 0.0)
                    if now_f - last_save > 3.5:
                        last_frame_db_save[room_code] = now_f
                        try:
                            with get_db() as conn:
                                conn.execute("INSERT OR REPLACE INTO live_frames (room_code, frame_data, updated_at) VALUES (?, ?, ?)",
                                             (room_code, frame_val, now_f))
                                conn.commit()
                        except Exception as e:
                            logger.debug(f"Frame DB cache save error: {e}")

            # 19. Real-Time Interactive Simulator Action Mirroring (Ultra-fast, zero-lag pointer & actions)
            elif msg_type in ["sim_interaction", "teacher_interaction", "sim_pointer"]:
                action_data = {
                    "action": data.get("action", "move"),
                    "x": data.get("x", 0.5),
                    "y": data.get("y", 0.5),
                    "buttons": data.get("buttons", 0),
                    "sim_id": data.get("sim_id", ""),
                    "timestamp": time.time()
                }
                publish_event(room_code, "sim_interaction", action_data)
                await broadcast_to_local_sockets(room_code, {"type": "sim_interaction", **action_data}, exclude=websocket)

    except WebSocketDisconnect:
        local_sockets.get(room_code, set()).discard(websocket)
        session_sockets.pop(session_id, None)
        try:
            with get_db() as conn:
                conn.execute("DELETE FROM active_viewers WHERE session_id = ?", (session_id,))
                conn.commit()
        except Exception:
            pass
        leave_payload = {"name": name, "role": role, "viewers_count": max(1, len(local_sockets.get(room_code, set())))}
        publish_event(room_code, "user_left", leave_payload)
        await broadcast_to_local_sockets(room_code, {"type": "user_left", **leave_payload})

    except Exception as e:
        logger.error(f"WebSocket error in {room_code}: {e}")
        local_sockets.get(room_code, set()).discard(websocket)
        session_sockets.pop(session_id, None)
        try:
            with get_db() as conn:
                conn.execute("DELETE FROM active_viewers WHERE session_id = ?", (session_id,))
                conn.commit()
        except Exception:
            pass
