import pytest

def test_register_student(client):
    res = client.post("/api/auth/register", json={
        "username": "new_student_7",
        "email": "student7@beheshti2.ir",
        "password": "Password123!",
        "full_name": "سهراب سپهری",
        "display_name": "سهراب",
        "grade_id": 1
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["username"] == "new_student_7"
    assert data["user"]["role"] == "student"

def test_login_success(client):
    res = client.post("/api/auth/login", json={
        "username": "admin",
        "password": "AdminPhysics1405!"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["role"] == "admin"

def test_login_invalid_credentials(client):
    res = client.post("/api/auth/login", json={
        "username": "admin",
        "password": "wrong-password"
    })
    assert res.status_code == 401

def test_protected_route_without_token(client):
    res = client.get("/api/auth/me")
    assert res.status_code == 401

def test_student_cannot_access_admin_endpoints(client):
    # Login as student
    login_res = client.post("/api/auth/login", json={
        "username": "student_beheshti",
        "password": "Student1405!"
    })
    assert login_res.status_code == 200
    student_token = login_res.json()["access_token"]

    # Attempt to access admin overview
    admin_res = client.get(
        "/api/admin/overview",
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert admin_res.status_code == 403
    assert "دسترسی غیرمجاز" in admin_res.json()["detail"]

def test_forced_password_change_workflow(client, db_session):
    from app.models.user import User
    from app.services.auth import hash_password

    # Setup admin with must_change_password = True
    admin = db_session.query(User).filter(User.username == "admin").first()
    admin.hashed_password = hash_password("admin_initial")
    admin.must_change_password = True
    db_session.commit()

    # Login as admin
    login_res = client.post("/api/auth/login", json={
        "username": "admin",
        "password": "admin_initial"
    })
    assert login_res.status_code == 200
    login_data = login_res.json()
    token = login_data["access_token"]
    assert login_data["user"]["must_change_password"] is True

    # Attempt to access protected admin endpoint before changing password -> Blocked 403
    admin_call = client.get("/api/admin/overview", headers={"Authorization": f"Bearer {token}"})
    assert admin_call.status_code == 403
    assert "PASSWORD_CHANGE_REQUIRED" in admin_call.json()["detail"]

    # Wrong current password
    fail_1 = client.post(
        "/api/auth/change-password",
        json={"current_password": "wrong", "new_password": "ValidNewPass1405!", "confirm_password": "ValidNewPass1405!"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert fail_1.status_code == 400
    assert "نادرست" in fail_1.json()["detail"]

    # Mismatched confirmation
    fail_2 = client.post(
        "/api/auth/change-password",
        json={"current_password": "admin_initial", "new_password": "ValidNewPass1405!", "confirm_password": "DifferentPass!"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert fail_2.status_code == 400

    # Successful password change
    succ_res = client.post(
        "/api/auth/change-password",
        json={"current_password": "admin_initial", "new_password": "StrongNewPassword1405!", "confirm_password": "StrongNewPassword1405!"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert succ_res.status_code == 200
    succ_data = succ_res.json()
    new_token = succ_data["access_token"]
    assert succ_data["user"]["must_change_password"] is False

    # Now admin access is granted
    allowed_call = client.get("/api/admin/overview", headers={"Authorization": f"Bearer {new_token}"})
    assert allowed_call.status_code == 200

    # Restore admin password for subsequent test isolation
    admin.hashed_password = hash_password("AdminPhysics1405!")
    admin.must_change_password = False
    db_session.commit()
