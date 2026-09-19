from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional
import os
import io
import base64

from backend.database import get_db, init_db, Task, Note, Conversation
from backend.config import settings
from backend.ai_service import ai_service
from pydantic import BaseModel

# Initialize FastAPI
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="AI Personal Assistant API"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str = "medium"
    due_date: Optional[datetime] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[str] = None
    due_date: Optional[datetime] = None

class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    completed: bool
    priority: str
    due_date: Optional[datetime]
    created_at: datetime
    updated_at: datetime

class NoteCreate(BaseModel):
    title: str
    content: Optional[str] = None

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

class NoteResponse(BaseModel):
    id: int
    title: str
    content: Optional[str]
    created_at: datetime
    updated_at: datetime

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

class ConversationResponse(BaseModel):
    id: int
    user_message: str
    ai_response: str
    created_at: datetime

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_db()

# Health check
@app.get("/health")
def health_check():
    return {"status": "healthy", "version": settings.app_version}

# Task endpoints
@app.post("/api/tasks", response_model=TaskResponse)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    db_task = Task(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.get("/api/tasks", response_model=List[TaskResponse])
def get_tasks(db: Session = Depends(get_db)):
    return db.query(Task).order_by(Task.created_at.desc()).all()

@app.get("/api/tasks/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@app.put("/api/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task_update: TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    for key, value in task_update.dict(exclude_unset=True).items():
        setattr(task, key, value)
    
    task.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(task)
    return task

@app.delete("/api/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"message": "Task deleted successfully"}

# Note endpoints
@app.post("/api/notes", response_model=NoteResponse)
def create_note(note: NoteCreate, db: Session = Depends(get_db)):
    db_note = Note(**note.dict())
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

@app.get("/api/notes", response_model=List[NoteResponse])
def get_notes(db: Session = Depends(get_db)):
    return db.query(Note).order_by(Note.created_at.desc()).all()

@app.get("/api/notes/{note_id}", response_model=NoteResponse)
def get_note(note_id: int, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@app.put("/api/notes/{note_id}", response_model=NoteResponse)
def update_note(note_id: int, note_update: NoteUpdate, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    for key, value in note_update.dict(exclude_unset=True).items():
        setattr(note, key, value)
    
    note.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(note)
    return note

@app.delete("/api/notes/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(note)
    db.commit()
    return {"message": "Note deleted successfully"}

# Chat endpoints
@app.post("/api/chat", response_model=ChatResponse)
async def chat(
    message: str = Form(...),
    file: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    # Get conversation history
    history = db.query(Conversation).order_by(Conversation.created_at.desc()).limit(10).all()
    history.reverse()  # Get in chronological order

    # If file is attached, read its content and add to message
    enhanced_message = message
    if file:
        try:
            file_content = await file.read()
            file_extension = file.filename.split('.')[-1].lower()

            if file_extension in ['txt']:
                text_content = file_content.decode('utf-8')
                enhanced_message = f"{message}\n\n[Attached file: {file.filename}]\nContent:\n{text_content}"
            elif file_extension in ['pdf', 'doc', 'docx']:
                enhanced_message = f"{message}\n\n[Attached file: {file.filename}] (File analysis not yet supported for this format)"
            elif file_extension in ['jpg', 'jpeg', 'png', 'gif']:
                enhanced_message = f"{message}\n\n[Attached image: {file.filename}] (Image analysis not yet supported)"
            else:
                enhanced_message = f"{message}\n\n[Attached file: {file.filename}]"
        except Exception as e:
            enhanced_message = f"{message}\n\n[Error reading file: {str(e)}]"

    # Get AI response
    response = await ai_service.chat(enhanced_message, history)

    # Save conversation
    conversation = Conversation(
        user_message=enhanced_message,
        ai_response=response
    )
    db.add(conversation)
    db.commit()

    return ChatResponse(response=response)

@app.get("/api/conversations", response_model=List[ConversationResponse])
def get_conversations(db: Session = Depends(get_db)):
    conversations = db.query(Conversation).order_by(Conversation.created_at.desc()).limit(50).all()
    return [
        ConversationResponse(
            id=c.id,
            user_message=c.user_message,
            ai_response=c.ai_response,
            created_at=c.created_at
        )
        for c in conversations
    ]

@app.delete("/api/conversations")
def clear_conversations(db: Session = Depends(get_db)):
    db.query(Conversation).delete()
    db.commit()
    return {"message": "Conversations cleared successfully"}

# Voice endpoints
@app.post("/api/voice-to-text")
async def voice_to_text(audio_file: UploadFile = File(...)):
    # This is a placeholder - in production, integrate with speech-to-text API
    # For now, return a mock response
    return {"text": "Voice input received (implement speech-to-text integration)"}

@app.post("/api/text-to-voice")
async def text_to_voice(text: str):
    # This is a placeholder - in production, integrate with TTS API
    # For now, return a mock response
    return {"audio_url": f"data:audio/mp3;base64,placeholder"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
