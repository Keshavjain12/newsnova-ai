from fastapi import APIRouter, Query, Depends
from app.services.chatbot import ask_chatbot
from app.core.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/chat", tags=["chat"])

@router.get("/")
async def chat(
    question: str = Query(..., description="Ask the AI a question"),
    current_user: User = Depends(get_current_user),
):
    if not question.strip():
        return {"error": "Question cannot be empty"}
    answer = await ask_chatbot(question)
    return {
        "question": question,
        "answer": answer,
        "model": "llama3.2:3b",
        "user": current_user.username,
    }
