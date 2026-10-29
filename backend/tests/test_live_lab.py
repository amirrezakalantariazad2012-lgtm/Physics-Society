import pytest

def test_live_lab_room_lifecycle(client):
    # 1. Create a live room
    create_res = client.post("/api/live-lab/rooms", json={
        "title": "کلاس مجازی فیزیک نهم - بررسی قوانین نیوتن",
        "sim_id": "forces-and-motion-basics",
        "sim_title": "نیرو و حرکت نیوتن",
        "grade": 9,
        "teacher_name": "استاد فیزیک سمپاد"
    })
    assert create_res.status_code == 200
    room_data = create_res.json()
    assert "room_code" in room_data
    room_code = room_data["room_code"]
    assert room_data["title"] == "کلاس مجازی فیزیک نهم - بررسی قوانین نیوتن"
    assert room_data["sim_id"] == "forces-and-motion-basics"

    # 2. List rooms and ensure the new room is present
    list_res = client.get("/api/live-lab/rooms")
    assert list_res.status_code == 200
    rooms = list_res.json()["rooms"]
    assert any(r["room_code"] == room_code for r in rooms)

    # 3. Get specific room details
    get_res = client.get(f"/api/live-lab/rooms/{room_code}")
    assert get_res.status_code == 200
    assert get_res.json()["room_code"] == room_code

    # 4. Post a chat message
    chat_res = client.post(f"/api/live-lab/rooms/{room_code}/chat", json={
        "sender": "علی احمدی",
        "role": "student",
        "message": "سلام استاد، شتاب گرانش چقدر است؟"
    })
    assert chat_res.status_code == 200
    assert chat_res.json()["success"] is True

    # 5. Clear chat messages
    clear_res = client.post(f"/api/live-lab/rooms/{room_code}/clear-chat")
    assert clear_res.status_code == 200
    assert clear_res.json()["success"] is True

    # 6. Delete room
    del_res = client.delete(f"/api/live-lab/rooms/{room_code}")
    assert del_res.status_code == 200
    assert del_res.json()["success"] is True

    # 7. Verify room no longer exists
    assert client.get(f"/api/live-lab/rooms/{room_code}").status_code == 404
