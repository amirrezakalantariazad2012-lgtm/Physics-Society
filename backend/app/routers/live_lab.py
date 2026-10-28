"""
Live Physics Laboratory & Synchronized Classroom Broadcasting Router
Enables teachers to run live interactive experiments with real-time state streaming to students.
Powered by Starlette WebSockets and asyncio broadcast.
"""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Optional, Dict, Set, Any
import asyncio
import time
import uuid
import logging

logger = logging.getLogger("physics_society.live_lab")

router = APIRouter(prefix="/live-lab", tags=["Live Laboratory Classroom"])

class RoomCreateRequest(BaseModel):
    title: str = Field(..., min_length=3, max_length=150)
    sim_id: str = Field("motion-1d", min_length=2, max_length=50)
    grade: Optional[int] = Field(9, ge=7, le=9)
    teacher_name: Optional[str] = Field("دبیر فیزیک سمپاد", max_length=100)

class RoomInfoResponse(BaseModel):
    room_code: str
    title: str
    sim_id: str
    grade: int
    teacher_name: str
    viewers_count: int
    created_at: float
    current_state: Dict[str, Any]
    teacher_notes: list[str]

class LiveLabRoom:
    def __init__(self, room_code: str, title: str, sim_id: str, grade: int, teacher_name: str):
        self.room_code = room_code
        self.title = title
        self.sim_id = sim_id
        self.grade = grade
        self.teacher_name = teacher_name
        self.created_at = time.time()
        self.sockets: Set[WebSocket] = set()
        self.teacher_socket: Optional[WebSocket] = None
        
        # Initial simulation state (Kinematics / General physics defaults)
        self.current_state: Dict[str, Any] = {
            "x0": 0.0,
            "v0": 0.0,
            "a": 0.0,
            "curX": 0.0,
            "curV": 0.0,
            "curA": 0.0,
            "curT": 0.0,
            "isRunning": False,
            "sim_id": sim_id
        }
        self.teacher_notes: list[str] = []
        self.active_poll: Optional[Dict[str, Any]] = None
        self.poll_votes: Dict[int, int] = {}

    async def broadcast(self, data: dict, exclude: Optional[WebSocket] = None):
        dead_sockets = set()
        for ws in self.sockets:
            if ws == exclude:
                continue
            try:
                await ws.send_json(data)
            except Exception:
                dead_sockets.add(ws)
        for dead in dead_sockets:
            self.sockets.discard(dead)

class LiveLabManager:
    def __init__(self):
        self.rooms: Dict[str, LiveLabRoom] = {}
        self._lock = asyncio.Lock()
        
        # Seed an official permanent demonstration classroom
        demo_code = "SMP-404"
        self.rooms[demo_code] = LiveLabRoom(
            room_code=demo_code,
            title="کلاس پژوهشی فیزیک سمپاد: حرکت بر خط راست و نمودارهای لحظه‌ای",
            sim_id="motion-1d",
            grade=9,
            teacher_name="دپارتمان فیزیک استعدادهای درخشان"
        )
        self.rooms[demo_code].teacher_notes.append("به مساحت زیر نمودار سرعت-زمان (Δx) و شیب خط مماس دقت کنید.")

    async def create_room(self, title: str, sim_id: str, grade: int, teacher_name: str) -> LiveLabRoom:
        async with self._lock:
            # Generate readable room code like SMP-XXX
            code = f"SMP-{uuid.uuid4().hex[:4].upper()}"
            room = LiveLabRoom(code, title, sim_id, grade, teacher_name)
            self.rooms[code] = room
            return room

    async def get_room(self, room_code: str) -> Optional[LiveLabRoom]:
        return self.rooms.get(room_code)

    async def close_room(self, room_code: str):
        async with self._lock:
            room = self.rooms.pop(room_code, None)
            if room:
                await room.broadcast({"type": "room_closed", "message": "این کلاس توسط دبیر پایان یافت."})

    def get_active_rooms(self) -> list[dict]:
        res = []
        for r in self.rooms.values():
            res.append({
                "room_code": r.room_code,
                "title": r.title,
                "sim_id": r.sim_id,
                "grade": r.grade,
                "teacher_name": r.teacher_name,
                "viewers_count": len(r.sockets),
                "created_at": r.created_at
            })
        return sorted(res, key=lambda x: x["created_at"], reverse=True)

lab_manager = LiveLabManager()

@router.get("/rooms")
async def list_active_rooms():
    """Lists all active live physics classroom broadcasts"""
    return {"rooms": lab_manager.get_active_rooms()}

@router.post("/create")
async def create_live_room(req: RoomCreateRequest):
    """Allows a teacher or admin to initiate a live synchronized experiment broadcast"""
    room = await lab_manager.create_room(
        title=req.title,
        sim_id=req.sim_id,
        grade=req.grade or 9,
        teacher_name=req.teacher_name or "دبیر فیزیک"
    )
    return {
        "success": True,
        "room_code": room.room_code,
        "title": room.title,
        "sim_id": room.sim_id,
        "share_url": f"/#live-lab/{room.room_code}"
    }

@router.get("/rooms/{room_code}")
async def get_room_details(room_code: str):
    room = await lab_manager.get_room(room_code)
    if not room:
        raise HTTPException(status_code=404, detail="اتاق پخش زنده یافت نشد یا پایان یافته است.")
    return {
        "room_code": room.room_code,
        "title": room.title,
        "sim_id": room.sim_id,
        "grade": room.grade,
        "teacher_name": room.teacher_name,
        "viewers_count": len(room.sockets),
        "created_at": room.created_at,
        "current_state": room.current_state,
        "teacher_notes": room.teacher_notes,
        "has_active_poll": room.active_poll is not None
    }

@router.websocket("/ws/{room_code}")
async def live_lab_websocket(
    websocket: WebSocket,
    room_code: str,
    role: str = Query("student"),
    name: str = Query("دانش‌آموز")
):
    """
    Real-time bidirectional WebSocket synchronization channel.
    Synchronizes physical variables, teacher annotations, laser pointers, and live classroom Q&A.
    """
    room = await lab_manager.get_room(room_code)
    if not room:
        await websocket.close(code=4004, reason="Room not found")
        return

    await websocket.accept()
    room.sockets.add(websocket)
    if role == "teacher":
        room.teacher_socket = websocket

    # Send current room state immediately upon connecting
    await websocket.send_json({
        "type": "welcome",
        "room_code": room.room_code,
        "title": room.title,
        "sim_id": room.sim_id,
        "teacher_name": room.teacher_name,
        "state": room.current_state,
        "teacher_notes": room.teacher_notes,
        "viewers_count": len(room.sockets),
        "role": role
    })

    # Broadcast arrival notification to the room
    await room.broadcast({
        "type": "user_joined",
        "name": name,
        "role": role,
        "viewers_count": len(room.sockets)
    }, exclude=websocket)

    try:
        while True:
            data = await websocket.receive_json()
            msg_type = data.get("type")

            # 1. Real-time Simulation State Update (From Teacher)
            if msg_type == "state_update":
                payload = data.get("payload", {})
                room.current_state.update(payload)
                # Forward live parameters to all students
                await room.broadcast({
                    "type": "state_sync",
                    "payload": payload,
                    "timestamp": time.time()
                }, exclude=websocket)

            # 2. Teacher Laser Pointer
            elif msg_type == "laser_pointer":
                await room.broadcast({
                    "type": "laser_pointer",
                    "x": data.get("x", 0.5),
                    "y": data.get("y", 0.5)
                }, exclude=websocket)

            # 3. Teacher Blackboard Notes
            elif msg_type == "teacher_note":
                note = data.get("note", "").strip()
                if note:
                    room.teacher_notes.append(note)
                    await room.broadcast({
                        "type": "teacher_note_added",
                        "note": note,
                        "notes": room.teacher_notes
                    })

            # 4. Live Student/Teacher Chat
            elif msg_type == "chat_message":
                text = data.get("message", "").strip()
                if text:
                    await room.broadcast({
                        "type": "chat_message",
                        "sender": name,
                        "role": role,
                        "message": text,
                        "time": time.strftime("%H:%M")
                    })

            # 5. Teacher Quick Concept Poll
            elif msg_type == "start_poll":
                poll_q = data.get("question", "")
                poll_opts = data.get("options", [])
                if poll_q and poll_opts:
                    room.active_poll = {"question": poll_q, "options": poll_opts}
                    room.poll_votes = {i: 0 for i in range(len(poll_opts))}
                    await room.broadcast({
                        "type": "poll_started",
                        "question": poll_q,
                        "options": poll_opts
                    })

            # 6. Student Poll Vote
            elif msg_type == "poll_vote":
                vote_idx = data.get("option_index")
                if room.active_poll and vote_idx is not None and vote_idx in room.poll_votes:
                    room.poll_votes[vote_idx] += 1
                    total = sum(room.poll_votes.values())
                    await room.broadcast({
                        "type": "poll_update",
                        "votes": room.poll_votes,
                        "total": total
                    })

    except WebSocketDisconnect:
        room.sockets.discard(websocket)
        if room.teacher_socket == websocket:
            room.teacher_socket = None
        await room.broadcast({
            "type": "user_left",
            "name": name,
            "role": role,
            "viewers_count": len(room.sockets)
        })
    except Exception as e:
        logger.error(f"WebSocket error in room {room_code}: {e}")
        room.sockets.discard(websocket)
