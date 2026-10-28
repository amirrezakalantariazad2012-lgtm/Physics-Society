"""
Live Physics Laboratory & Synchronized Classroom Broadcasting Router
Shared SQLite WAL Repository supporting multi-worker Uvicorn processes and Docker containers.
Enables teachers to conduct live experiments while students watch and interact live with zero lag.
"""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Dict, Set, Any
import asyncio
import sqlite3
import json
import time
import uuid
import os
import logging

logger = logging.getLogger("physics_society.live_lab")

router = APIRouter(prefix="/live-lab", tags=["Live Laboratory Classroom"])

# SQLite DB Path (inside shared uploads directory)
DB_DIR = os.getenv("UPLOAD_DIR", os.path.abspath("data/uploads"))
os.makedirs(DB_DIR, exist_ok=True)
DB_PATH = os.path.join(DB_DIR, "live_lab_rooms.db")

def get_db():
    conn = sqlite3.connect(DB_PATH, timeout=10.0)
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.row_factory = sqlite3.Row
    return conn

def init_live_db():
    with get_db() as conn:
        conn.execute("""
        CREATE TABLE IF NOT EXISTS rooms (
            room_code TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            sim_id TEXT NOT NULL,
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
                "به مساحت سطح زیر نمودار سرعت-زمان (Δx) و شیب خط مماس (شتاب لحظه‌ای) دقت کنید."
            ])
            conn.execute("""
            INSERT INTO rooms (room_code, title, sim_id, grade, teacher_name, current_state_json, teacher_notes_json, active_poll_json, poll_votes_json, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, NULL, NULL, ?, ?)
            """, (demo_code, "کلاس پژوهشی فیزیک سمپاد: حرکت بر خط راست و نمودارهای لحظه‌ای", "motion-1d", 9, "دپارتمان فیزیک استعدادهای درخشان", default_state, default_notes, time.time(), time.time()))
            conn.commit()

init_live_db()

# Local worker socket connections
local_sockets: Dict[str, Set[WebSocket]] = {}

class RoomCreateRequest(BaseModel):
    title: str = Field(..., min_length=3, max_length=150)
    sim_id: str = Field("motion-1d", min_length=2, max_length=50)
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

class PollStartRequest(BaseModel):
    question: str
    options: list[str]

class PollVoteRequest(BaseModel):
    option_index: int

@router.get("/rooms")
async def list_active_rooms():
    """Lists all active live physics classroom broadcasts across all workers"""
    with get_db() as conn:
        cur = conn.execute("SELECT room_code, title, sim_id, grade, teacher_name, created_at, updated_at FROM rooms ORDER BY updated_at DESC")
        rows = cur.fetchall()
        rooms = []
        for r in rows:
            rooms.append({
                "room_code": r["room_code"],
                "title": r["title"],
                "sim_id": r["sim_id"],
                "grade": r["grade"],
                "teacher_name": r["teacher_name"],
                "viewers_count": len(local_sockets.get(r["room_code"], set())),
                "created_at": r["created_at"],
                "updated_at": r["updated_at"]
            })
    return {"rooms": rooms}

@router.post("/create")
async def create_live_room(req: RoomCreateRequest):
    """Creates a shared live classroom accessible across all worker processes"""
    code = f"SMP-{uuid.uuid4().hex[:4].upper()}"
    default_state = json.dumps({
        "x0": 0.0, "v0": 0.0, "a": 0.0,
        "curX": 0.0, "curV": 0.0, "curA": 0.0, "curT": 0.0,
        "isRunning": False, "sim_id": req.sim_id
    })
    now = time.time()
    with get_db() as conn:
        conn.execute("""
        INSERT INTO rooms (room_code, title, sim_id, grade, teacher_name, current_state_json, teacher_notes_json, active_poll_json, poll_votes_json, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, '[]', NULL, NULL, ?, ?)
        """, (code, req.title, req.sim_id, req.grade or 9, req.teacher_name or "دبیر فیزیک", default_state, now, now))
        conn.commit()

    return {
        "success": True,
        "room_code": code,
        "title": req.title,
        "sim_id": req.sim_id,
        "share_url": f"/#live-lab/{code}"
    }

@router.get("/rooms/{room_code}")
async def get_room_details(room_code: str):
    with get_db() as conn:
        cur = conn.execute("SELECT * FROM rooms WHERE room_code = ?", (room_code,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="اتاق پخش زنده یافت نشد.")

        # Fetch recent chat messages
        cur_chat = conn.execute("SELECT sender, role, message, created_at FROM chat_messages WHERE room_code = ? ORDER BY id DESC LIMIT 30", (room_code,))
        chat_rows = cur_chat.fetchall()
        chat_history = [{
            "sender": c["sender"],
            "role": c["role"],
            "message": c["message"],
            "time": time.strftime("%H:%M", time.localtime(c["created_at"]))
        } for c in reversed(chat_rows)]

        current_state = json.loads(row["current_state_json"])
        teacher_notes = json.loads(row["teacher_notes_json"])

        return {
            "room_code": row["room_code"],
            "title": row["title"],
            "sim_id": row["sim_id"],
            "grade": row["grade"],
            "teacher_name": row["teacher_name"],
            "viewers_count": len(local_sockets.get(room_code, set())),
            "created_at": row["created_at"],
            "updated_at": row["updated_at"],
            "current_state": current_state,
            "teacher_notes": teacher_notes,
            "chat_history": chat_history,
            "has_active_poll": row["active_poll_json"] is not None
        }

@router.get("/rooms/{room_code}/sync")
async def sync_room_state(room_code: str, since: float = Query(0.0)):
    """Fast polling sync endpoint guaranteeing lockstep across multi-worker Uvicorn instances"""
    with get_db() as conn:
        cur = conn.execute("SELECT current_state_json, teacher_notes_json, active_poll_json, poll_votes_json, updated_at FROM rooms WHERE room_code = ?", (room_code,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Room not found")

        # Fetch chat messages since last check
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

    # Broadcast to local worker sockets
    await broadcast_to_local_sockets(room_code, {
        "type": "state_sync",
        "payload": req.payload,
        "updated_at": now
    })
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
        "type": "chat_message",
        "sender": req.sender,
        "role": req.role,
        "message": req.message,
        "time": time.strftime("%H:%M")
    }
    await broadcast_to_local_sockets(room_code, msg_data)
    return {"success": True, "message": msg_data}

@router.post("/rooms/{room_code}/note")
async def post_teacher_note(room_code: str, req: TeacherNoteRequest):
    """Allows teacher to add chalkboard notes"""
    now = time.time()
    with get_db() as conn:
        cur = conn.execute("SELECT teacher_notes_json FROM rooms WHERE room_code = ?", (room_code,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Room not found")
        
        notes = json.loads(row["teacher_notes_json"])
        notes.append(req.note)

        conn.execute("UPDATE rooms SET teacher_notes_json = ?, updated_at = ? WHERE room_code = ?", (json.dumps(notes), now, room_code))
        conn.commit()

    await broadcast_to_local_sockets(room_code, {
        "type": "teacher_note_added",
        "note": req.note,
        "notes": notes
    })
    return {"success": True, "notes": notes}

async def broadcast_to_local_sockets(room_code: str, data: dict, exclude: Optional[WebSocket] = None):
    sockets = local_sockets.get(room_code, set())
    dead = set()
    for ws in sockets:
        if ws == exclude:
            continue
        try:
            await ws.send_json(data)
        except Exception:
            dead.add(ws)
    for d in dead:
        sockets.discard(d)

@router.websocket("/ws/{room_code}")
async def live_lab_websocket(
    websocket: WebSocket,
    room_code: str,
    role: str = Query("student"),
    name: str = Query("دانش‌آموز")
):
    """Websocket real-time push with shared SQLite persistence"""
    # Verify room exists in database
    with get_db() as conn:
        cur = conn.execute("SELECT * FROM rooms WHERE room_code = ?", (room_code,))
        row = cur.fetchone()
        if not row:
            await websocket.close(code=4004, reason="Room not found")
            return

        current_state = json.loads(row["current_state_json"])
        teacher_notes = json.loads(row["teacher_notes_json"])
        room_title = row["title"]
        sim_id = row["sim_id"]
        teacher_name = row["teacher_name"]

    await websocket.accept()

    if room_code not in local_sockets:
        local_sockets[room_code] = set()
    local_sockets[room_code].add(websocket)

    # Send initial welcome state
    await websocket.send_json({
        "type": "welcome",
        "room_code": room_code,
        "title": room_title,
        "sim_id": sim_id,
        "teacher_name": teacher_name,
        "state": current_state,
        "teacher_notes": teacher_notes,
        "viewers_count": len(local_sockets[room_code]),
        "role": role
    })

    # Broadcast user joined
    await broadcast_to_local_sockets(room_code, {
        "type": "user_joined",
        "name": name,
        "role": role,
        "viewers_count": len(local_sockets[room_code])
    }, exclude=websocket)

    try:
        while True:
            data = await websocket.receive_json()
            msg_type = data.get("type")

            # Real-time state update from teacher
            if msg_type == "state_update":
                payload = data.get("payload", {})
                now = time.time()
                with get_db() as conn:
                    cur = conn.execute("SELECT current_state_json FROM rooms WHERE room_code = ?", (room_code,))
                    r = cur.fetchone()
                    if r:
                        st = json.loads(r["current_state_json"])
                        st.update(payload)
                        conn.execute("UPDATE rooms SET current_state_json = ?, updated_at = ? WHERE room_code = ?", (json.dumps(st), now, room_code))
                        conn.commit()

                await broadcast_to_local_sockets(room_code, {
                    "type": "state_sync",
                    "payload": payload,
                    "timestamp": now
                }, exclude=websocket)

            elif msg_type == "laser_pointer":
                await broadcast_to_local_sockets(room_code, {
                    "type": "laser_pointer",
                    "x": data.get("x", 0.5),
                    "y": data.get("y", 0.5)
                }, exclude=websocket)

            elif msg_type == "chat_message":
                text = data.get("message", "").strip()
                if text:
                    now = time.time()
                    with get_db() as conn:
                        conn.execute("INSERT INTO chat_messages (room_code, sender, role, message, created_at) VALUES (?, ?, ?, ?, ?)",
                                     (room_code, name, role, text, now))
                        conn.commit()

                    await broadcast_to_local_sockets(room_code, {
                        "type": "chat_message",
                        "sender": name,
                        "role": role,
                        "message": text,
                        "time": time.strftime("%H:%M")
                    })

    except WebSocketDisconnect:
        local_sockets.get(room_code, set()).discard(websocket)
        await broadcast_to_local_sockets(room_code, {
            "type": "user_left",
            "name": name,
            "role": role,
            "viewers_count": len(local_sockets.get(room_code, set()))
        })
    except Exception as e:
        logger.error(f"WebSocket error in {room_code}: {e}")
        local_sockets.get(room_code, set()).discard(websocket)
