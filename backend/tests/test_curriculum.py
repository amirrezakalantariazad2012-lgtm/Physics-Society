import pytest

def test_get_grades(client):
    res = client.get("/api/curriculum/grades")
    assert res.status_code == 200
    grades = res.json()
    assert len(grades) == 3
    numbers = [g["number"] for g in grades]
    assert 7 in numbers and 8 in numbers and 9 in numbers

def test_get_books_by_grade(client):
    res = client.get("/api/curriculum/grades/1/books")
    assert res.status_code == 200
    books = res.json()
    assert len(books) >= 2
    types = [b["book_type"] for b in books]
    assert "standard" in types
    assert "sampad" in types

def test_lesson_detail_and_exercise_flow(client):
    # Login as student
    login_res = client.post("/api/auth/login", json={
        "username": "student_beheshti",
        "password": "Student1405!"
    })
    token = login_res.json()["access_token"]

    # Get lesson 1
    lesson_res = client.get("/api/curriculum/lessons/1", headers={"Authorization": f"Bearer {token}"})
    assert lesson_res.status_code == 200
    lesson = lesson_res.json()
    assert "content_blocks" in lesson
    assert len(lesson["exercises"]) >= 1

    # Submit an exercise
    first_ex = lesson["exercises"][0]
    sub_res = client.post(
        "/api/curriculum/exercises/submit",
        json={"exercise_id": first_ex["id"], "submitted_answer": 1},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert sub_res.status_code == 200
    sub_data = sub_res.json()
    assert "is_correct" in sub_data
    assert "explanation_fa" in sub_data

    # Complete lesson
    comp_res = client.post(
        f"/api/curriculum/lessons/{lesson['id']}/complete",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert comp_res.status_code == 200
    assert comp_res.json()["success"] is True

def test_student_grade_scoping_enforcement(client, db_session):
    from app.models.curriculum import Book, Chapter, Lesson
    from app.models.exam import Examination

    # Login as student_beheshti (Grade 7)
    login_res = client.post("/api/auth/login", json={
        "username": "student_beheshti",
        "password": "Student1405!"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Find Grade 8 book, chapter, and lesson
    g8_book = db_session.query(Book).filter(Book.code == "g8_b1").first()
    g8_chapter = db_session.query(Chapter).filter(Chapter.book_id == g8_book.id).first()
    g8_lesson = db_session.query(Lesson).filter(Lesson.chapter_id == g8_chapter.id).first()
    g8_exam = db_session.query(Examination).filter(Examination.chapter_id == g8_chapter.id).first()

    # 1. Accessing Grade 8 books -> 403 Forbidden
    res_books = client.get(f"/api/curriculum/grades/{g8_book.grade_id}/books", headers=headers)
    assert res_books.status_code == 403
    assert "دسترسی غیرمجاز" in res_books.json()["detail"]

    # 2. Accessing Grade 8 chapters -> 403 Forbidden
    res_chapters = client.get(f"/api/curriculum/books/{g8_book.id}/chapters", headers=headers)
    assert res_chapters.status_code == 403

    # 3. Accessing Grade 8 chapter detail -> 403 Forbidden
    res_ch_detail = client.get(f"/api/curriculum/chapters/{g8_chapter.id}", headers=headers)
    assert res_ch_detail.status_code == 403

    # 4. Accessing Grade 8 lesson detail -> 403 Forbidden
    res_lesson = client.get(f"/api/curriculum/lessons/{g8_lesson.id}", headers=headers)
    assert res_lesson.status_code == 403

    # 5. Starting Grade 8 exam -> 403 Forbidden
    if g8_exam:
        res_exam = client.post(f"/api/exams/{g8_exam.id}/start", headers=headers)
        assert res_exam.status_code == 403
        assert "دسترسی غیرمجاز" in res_exam.json()["detail"]
