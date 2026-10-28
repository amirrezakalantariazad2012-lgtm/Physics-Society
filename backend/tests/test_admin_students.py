import pytest
from app.models.user import User, StudentProfile

def test_admin_student_full_management_suite(client, db_session):
    # 1. Login as admin
    login_res = client.post("/api/auth/login", json={
        "username": "admin",
        "password": "AdminPhysics1405!"
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Create student
    create_payload = {
        "full_name": "آرتین رضوانی",
        "username": "artin_test",
        "password": "ArtinPassword123",
        "grade_id": 3,
        "email": "artin@test.ir",
        "student_number": "14030999",
        "initial_xp": 100
    }
    create_res = client.post("/api/admin/students/create", json=create_payload, headers=headers)
    assert create_res.status_code == 200, create_res.text
    created_id = create_res.json()["student_id"]
    assert created_id > 0

    # 3. List students and verify filtering
    list_res = client.get("/api/admin/students?search=artin_test", headers=headers)
    assert list_res.status_code == 200
    students = list_res.json()
    assert len(students) >= 1
    target = next((s for s in students if s["username"] == "artin_test"), None)
    assert target is not None
    assert target["full_name"] == "آرتین رضوانی"
    assert target["grade_id"] == 3
    assert target["total_xp"] == 100

    # 4. Get student details dossier
    detail_res = client.get(f"/api/admin/students/{created_id}/details", headers=headers)
    assert detail_res.status_code == 200
    dossier = detail_res.json()
    assert dossier["username"] == "artin_test"
    assert dossier["profile"]["grade_id"] == 3
    assert dossier["profile"]["total_xp"] == 100

    # 5. Update student (change grade to 2, update name, and grant XP)
    update_payload = {
        "full_name": "آرتین رضوانی پور",
        "grade_id": 2,
        "total_xp": 250,
        "current_level": 3,
        "current_streak": 5
    }
    update_res = client.put(f"/api/admin/students/{created_id}", json=update_payload, headers=headers)
    assert update_res.status_code == 200
    assert update_res.json()["success"] is True

    # Verify update persisted
    verify_res = client.get(f"/api/admin/students/{created_id}/details", headers=headers)
    assert verify_res.json()["full_name"] == "آرتین رضوانی پور"
    assert verify_res.json()["profile"]["grade_id"] == 2
    assert verify_res.json()["profile"]["total_xp"] == 250
    assert verify_res.json()["profile"]["current_level"] == 3
    assert verify_res.json()["profile"]["current_streak"] == 5

    # 6. Direct password reset
    reset_pw_res = client.post(
        f"/api/admin/students/{created_id}/reset-password",
        json={"new_password": "NewSecretPassword1405"},
        headers=headers
    )
    assert reset_pw_res.status_code == 200

    # Verify student can login with new password!
    student_login = client.post("/api/auth/login", json={
        "username": "artin_test",
        "password": "NewSecretPassword1405"
    })
    assert student_login.status_code == 200, "Student must be able to login with newly reset password"

    # 7. Adjust student XP
    adjust_res = client.post(
        f"/api/admin/students/{created_id}/adjust-xp",
        json={"amount": 75, "reason": "پاداش المپیاد فیزیک"},
        headers=headers
    )
    assert adjust_res.status_code == 200
    assert adjust_res.json()["total_xp"] == 325

    # 8. Toggle student status (deactivate / reactivate)
    toggle_res = client.post(f"/api/admin/students/{created_id}/toggle-status", headers=headers)
    assert toggle_res.status_code == 200
    assert toggle_res.json()["is_active"] is False

    # 9. Delete student account
    del_res = client.delete(f"/api/admin/students/{created_id}", headers=headers)
    assert del_res.status_code == 200

    # Verify student is gone
    get_deleted = client.get(f"/api/admin/students/{created_id}/details", headers=headers)
    assert get_deleted.status_code == 404
