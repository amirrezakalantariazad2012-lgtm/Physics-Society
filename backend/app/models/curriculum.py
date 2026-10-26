from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Float, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class Grade(Base):
    __tablename__ = "grades"

    id = Column(Integer, primary_key=True, index=True)
    number = Column(Integer, unique=True, nullable=False, index=True)  # 7, 8, 9
    title_fa = Column(String(64), nullable=False)  # پایه هفتم, پایه هشتم, پایه نهم
    description_fa = Column(Text, nullable=True)

    # Relationships
    books = relationship("Book", back_populates="grade", cascade="all, delete-orphan")
    students = relationship("StudentProfile", back_populates="grade")
    examinations = relationship("Examination", back_populates="grade")
    competitions = relationship("Competition", back_populates="grade")
    questions = relationship("Question", back_populates="grade")


class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    grade_id = Column(Integer, ForeignKey("grades.id", ondelete="CASCADE"), nullable=False, index=True)
    code = Column(String(32), unique=True, nullable=False, index=True)  # g7_b1, g7_b2, etc.
    title_fa = Column(String(128), nullable=False)
    book_type = Column(String(32), default="standard", nullable=False)  # 'standard' (کتاب رسمی) or 'sampad' (تکمیلی سمپاد)
    publisher_fa = Column(String(128), default="وزارت آموزش و پرورش", nullable=False)
    academic_year = Column(String(32), default="1404-1405", nullable=False)
    cover_image_url = Column(String(256), nullable=True)

    # Relationships
    grade = relationship("Grade", back_populates="books")
    sources = relationship("TextbookSource", back_populates="book", cascade="all, delete-orphan")
    chapters = relationship("Chapter", back_populates="book", cascade="all, delete-orphan")
    questions = relationship("Question", back_populates="book")
    extracted_sections = relationship("ExtractedTextSection", back_populates="book", cascade="all, delete-orphan")


class TextbookSource(Base):
    __tablename__ = "textbook_sources"

    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("books.id", ondelete="CASCADE"), nullable=False, index=True)
    source_url = Column(String(512), nullable=True)
    original_filename = Column(String(256), nullable=False)
    stored_path = Column(String(512), nullable=False)
    file_size_bytes = Column(Integer, default=0)
    page_count = Column(Integer, default=0)
    file_hash = Column(String(64), nullable=True)
    status = Column(String(32), default="pending", nullable=False)  # pending, processing, completed, failed
    error_message = Column(Text, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    processed_at = Column(DateTime, nullable=True)

    # Relationships
    book = relationship("Book", back_populates="sources")
    processing_jobs = relationship("TextbookProcessingJob", back_populates="source", cascade="all, delete-orphan")
    extracted_sections = relationship("ExtractedTextSection", back_populates="source", cascade="all, delete-orphan")


class TextbookProcessingJob(Base):
    __tablename__ = "textbook_processing_jobs"

    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(Integer, ForeignKey("textbook_sources.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(String(32), default="pending", nullable=False)  # pending, running, completed, failed
    progress_percent = Column(Float, default=0.0)
    total_pages = Column(Integer, default=0)
    processed_pages = Column(Integer, default=0)
    extracted_sections_count = Column(Integer, default=0)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    log_output = Column(Text, nullable=True)

    # Relationships
    source = relationship("TextbookSource", back_populates="processing_jobs")


class ExtractedTextSection(Base):
    __tablename__ = "extracted_text_sections"

    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(Integer, ForeignKey("textbook_sources.id", ondelete="CASCADE"), nullable=False, index=True)
    book_id = Column(Integer, ForeignKey("books.id", ondelete="CASCADE"), nullable=False, index=True)
    page_number = Column(Integer, nullable=False, index=True)
    chapter_num = Column(Integer, nullable=True, index=True)
    heading_fa = Column(String(256), nullable=True)
    content_fa = Column(Text, nullable=False)
    section_type = Column(String(32), default="text")  # text, definition, experiment, table, equation, worked_example
    confidence_score = Column(Float, default=1.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    source = relationship("TextbookSource", back_populates="extracted_sections")
    book = relationship("Book", back_populates="extracted_sections")


class Chapter(Base):
    __tablename__ = "chapters"

    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("books.id", ondelete="CASCADE"), nullable=False, index=True)
    chapter_number = Column(Integer, nullable=False)  # 2, 8, 9, 10, etc.
    title_fa = Column(String(128), nullable=False)
    slug = Column(String(128), nullable=False)
    description_fa = Column(Text, nullable=True)
    estimated_minutes = Column(Integer, default=60)
    order_index = Column(Integer, default=1)
    is_published = Column(Boolean, default=True, index=True)
    objectives_fa = Column(Text, nullable=True)
    prerequisites_fa = Column(Text, nullable=True)
    source_pages = Column(String(64), nullable=True)  # e.g. "ص ۶ الی ۲۰"

    # Relationships
    book = relationship("Book", back_populates="chapters")
    topics = relationship("Topic", back_populates="chapter", cascade="all, delete-orphan")
    lessons = relationship("Lesson", back_populates="chapter", cascade="all, delete-orphan")
    questions = relationship("Question", back_populates="chapter", cascade="all, delete-orphan")
    examinations = relationship("Examination", back_populates="chapter")
    student_progress = relationship("StudentProgress", back_populates="chapter", cascade="all, delete-orphan")


class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)
    chapter_id = Column(Integer, ForeignKey("chapters.id", ondelete="CASCADE"), nullable=False, index=True)
    topic_number = Column(Integer, default=1)
    title_fa = Column(String(128), nullable=False)
    description_fa = Column(Text, nullable=True)
    order_index = Column(Integer, default=1)

    # Relationships
    chapter = relationship("Chapter", back_populates="topics")
    lessons = relationship("Lesson", back_populates="topic", cascade="all, delete-orphan")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    chapter_id = Column(Integer, ForeignKey("chapters.id", ondelete="CASCADE"), nullable=False, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id", ondelete="SET NULL"), nullable=True, index=True)
    title_fa = Column(String(128), nullable=False)
    slug = Column(String(128), nullable=False)
    order_index = Column(Integer, default=1)
    is_published = Column(Boolean, default=True, index=True)
    estimated_minutes = Column(Integer, default=15)
    xp_reward = Column(Integer, default=25)
    
    # Lesson content structured blocks
    # Contains: introduction, conceptual_explanations, definitions, equations, experiments,
    # everyday_applications, common_misconceptions, step_by_step_examples, summary, review_quiz
    content_blocks = Column(JSON, nullable=False, default=dict)
    summary_fa = Column(Text, nullable=True)
    source_pages_ref = Column(String(128), nullable=True)  # "کتاب درسی ص ۱۲-۱۶"
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    chapter = relationship("Chapter", back_populates="lessons")
    topic = relationship("Topic", back_populates="lessons")
    exercises = relationship("Exercise", back_populates="lesson", cascade="all, delete-orphan")
    student_progress = relationship("StudentProgress", back_populates="lesson", cascade="all, delete-orphan")


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False, index=True)
    order_index = Column(Integer, default=1)
    exercise_type = Column(String(32), nullable=False)  # mcq, true_false, fill_blank, matching, ordering, numerical
    prompt_fa = Column(Text, nullable=False)
    options_json = Column(JSON, nullable=True)  # List of choices or pairs
    correct_answer_json = Column(JSON, nullable=False)  # Target value, key, or list
    explanation_fa = Column(Text, nullable=True)
    xp_reward = Column(Integer, default=5)

    # Relationships
    lesson = relationship("Lesson", back_populates="exercises")


class SupplementaryMaterial(Base):
    """
    درسنامه‌ها، جزوات متفرقه، فرمول‌نامه‌ها و فایل‌های تکمیلی آموزشی انجمن فیزیک
    """
    __tablename__ = "supplementary_materials"

    id = Column(Integer, primary_key=True, index=True)
    title_fa = Column(String(256), nullable=False)
    description_fa = Column(Text, nullable=True)
    grade_id = Column(Integer, ForeignKey("grades.id", ondelete="SET NULL"), nullable=True, index=True)
    author_name = Column(String(128), default="دبیران انجمن فیزیک شهید بهشتی دو", nullable=True)
    category = Column(String(64), default="pamphlet", nullable=False)  # pamphlet (جزوه), summary (خلاصه درس), formula_sheet (فرمول‌نامه), sample_questions (نمونه سوال)
    file_url = Column(String(512), nullable=True)
    original_filename = Column(String(256), nullable=True)
    file_size_bytes = Column(Integer, default=0)
    download_count = Column(Integer, default=0)
    is_published = Column(Boolean, default=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    grade = relationship("Grade")

