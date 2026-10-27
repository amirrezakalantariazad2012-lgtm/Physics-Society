import os
import pytest
from app.config import settings

def get_admin_token(client):
    res = client.post("/api/auth/login", json={"username": "admin", "password": "AdminPhysics1405!"})
    if res.status_code != 200:
        res = client.post("/api/auth/login", json={"username": "admin", "password": "admin"})
    assert res.status_code == 200
    return res.json()["access_token"]


def test_study_material_upload_and_iso_pdf(client):
    token = get_admin_token(client)
    headers = {"Authorization": f"Bearer {token}"}

    # ISO 32000-1 compliant PDF: starts with UTF-8 BOM, followed by %PDF-
    bom_pdf_content = b"\xef\xbb\xbf%PDF-1.7\nSample Physics Pamphlet for High School"
    files = {"file": ("test_pamphlet.pdf", bom_pdf_content, "application/pdf")}

    upload_res = client.post("/api/curriculum/study-materials/upload", files=files, headers=headers)
    assert upload_res.status_code == 200
    upload_data = upload_res.json()
    assert upload_data["success"] is True
    assert upload_data["file_url"].startswith("/uploads/materials/")
    file_url = upload_data["file_url"]

    # Verify physical file was written to disk in settings.UPLOAD_DIR
    rel_path = file_url[len("/uploads/"):].lstrip("/")
    full_path = os.path.abspath(os.path.join(settings.UPLOAD_DIR, rel_path))
    assert os.path.isfile(full_path)

    # Create study material
    create_res = client.post("/api/curriculum/study-materials", json={
        "title_fa": "جزوه فیزیک اتمی و کوانتوم",
        "description_fa": "توضیحات تکمیلی مبحث فوتون و اثر فوتوالکتریک",
        "grade_id": 3,
        "author_name": "استاد فیزیک سمپاد",
        "category": "pamphlet",
        "file_url": file_url,
        "original_filename": "test_pamphlet.pdf",
        "file_size_bytes": len(bom_pdf_content)
    }, headers=headers)
    assert create_res.status_code == 200
    created = create_res.json()
    assert created["file_exists_on_disk"] is True
    material_id = created["id"]

    # Retrieve materials list
    list_res = client.get("/api/curriculum/study-materials?category=pamphlet")
    assert list_res.status_code == 200
    items = list_res.json()
    matching = [it for it in items if it["id"] == material_id]
    assert len(matching) == 1
    assert matching[0]["file_exists_on_disk"] is True

    # Clean up
    del_res = client.delete(f"/api/curriculum/study-materials/{material_id}", headers=headers)
    assert del_res.status_code == 200
    assert not os.path.exists(full_path)


def test_study_material_doc_and_ppt_support(client):
    token = get_admin_token(client)
    headers = {"Authorization": f"Bearer {token}"}

    # Word .doc OLE signature
    ole_header = b"\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1" + b"\x00" * 32 + b"Physics Question Bank in Word 97"
    files = {"file": ("mechanics_questions.doc", ole_header, "application/msword")}
    res_doc = client.post("/api/curriculum/study-materials/upload", files=files, headers=headers)
    assert res_doc.status_code == 200
    doc_url = res_doc.json()["file_url"]

    # PPTX PK zip signature
    pk_header = b"PK\x03\x04" + b"\x00" * 20 + b"Presentation Slide deck"
    files = {"file": ("kinematics_presentation.pptx", pk_header, "application/vnd.openxmlformats-officedocument.presentationml.presentation")}
    res_ppt = client.post("/api/curriculum/study-materials/upload", files=files, headers=headers)
    assert res_ppt.status_code == 200

    # Clean up uploaded test files
    for url in [doc_url, res_ppt.json()["file_url"]]:
        rel = url[len("/uploads/"):].lstrip("/")
        fp = os.path.abspath(os.path.join(settings.UPLOAD_DIR, rel))
        if os.path.exists(fp):
            os.remove(fp)


def test_study_material_edit_and_file_replacement(client):
    token = get_admin_token(client)
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Upload initial file
    f1 = b"%PDF-1.4\nInitial Version 1.0"
    upload1 = client.post("/api/curriculum/study-materials/upload", files={"file": ("v1.pdf", f1, "application/pdf")}, headers=headers).json()
    url1 = upload1["file_url"]
    path1 = os.path.abspath(os.path.join(settings.UPLOAD_DIR, url1[len("/uploads/"):].lstrip("/")))
    assert os.path.isfile(path1)

    # 2. Create material
    mat_res = client.post("/api/curriculum/study-materials", json={
        "title_fa": "فرمول‌نامه ترم اول",
        "category": "summary",
        "file_url": url1,
        "original_filename": "v1.pdf",
        "file_size_bytes": len(f1)
    }, headers=headers).json()
    mat_id = mat_res["id"]

    # 3. Upload replacement file (v2)
    f2 = b"%PDF-1.5\nUpdated Version 2.0 with Corrections"
    upload2 = client.post("/api/curriculum/study-materials/upload", files={"file": ("v2.pdf", f2, "application/pdf")}, headers=headers).json()
    url2 = upload2["file_url"]
    path2 = os.path.abspath(os.path.join(settings.UPLOAD_DIR, url2[len("/uploads/"):].lstrip("/")))
    assert os.path.isfile(path2)

    # 4. Update material to point to v2
    update_res = client.put(f"/api/curriculum/study-materials/{mat_id}", json={
        "title_fa": "فرمول‌نامه ترم اول (ویرایش دوم)",
        "file_url": url2,
        "original_filename": "v2.pdf",
        "file_size_bytes": len(f2)
    }, headers=headers)
    assert update_res.status_code == 200
    updated_data = update_res.json()
    assert updated_data["title_fa"] == "فرمول‌نامه ترم اول (ویرایش دوم)"
    assert updated_data["file_url"] == url2

    # Old physical file MUST be removed from disk
    assert not os.path.exists(path1)
    # New physical file MUST exist on disk
    assert os.path.isfile(path2)

    # 5. Delete material and verify path2 is removed
    del_res = client.delete(f"/api/curriculum/study-materials/{mat_id}", headers=headers)
    assert del_res.status_code == 200
    assert not os.path.exists(path2)


def test_orphaned_material_detection_and_cleanup(client):
    token = get_admin_token(client)
    headers = {"Authorization": f"Bearer {token}"}

    # Create material with a non-existent physical file
    phantom_url = "/uploads/materials/non_existent_phantom_file.pdf"
    mat_res = client.post("/api/curriculum/study-materials", json={
        "title_fa": "جزوه مفقود قدیمی",
        "category": "pamphlet",
        "file_url": phantom_url,
        "original_filename": "phantom.pdf",
        "file_size_bytes": 1024
    }, headers=headers).json()
    mat_id = mat_res["id"]

    # Check GET list: file_exists_on_disk must be False
    list_res = client.get("/api/curriculum/study-materials")
    assert list_res.status_code == 200
    found = [m for m in list_res.json() if m["id"] == mat_id]
    assert len(found) == 1
    assert found[0]["file_exists_on_disk"] is False

    # Trigger cleanup-orphaned
    cleanup_res = client.post("/api/curriculum/study-materials/cleanup-orphaned", headers=headers)
    assert cleanup_res.status_code == 200
    cleanup_data = cleanup_res.json()
    assert cleanup_data["success"] is True
    assert cleanup_data["deleted_count"] >= 1
    assert "جزوه مفقود قدیمی" in cleanup_data["deleted_titles"]

    # Verify material is no longer in database
    list_after = client.get("/api/curriculum/study-materials").json()
    assert not any(m["id"] == mat_id for m in list_after)
