from fastapi import APIRouter, Depends
from models.report import ChatRequest
from services.gemini_service import gemini_service
from database import Database
from utils.dependencies import get_current_user
from datetime import datetime

router = APIRouter(prefix="/chatbot", tags=["Citizen AI Copilot"])

@router.post("/chat")
async def chat_with_copilot(request: ChatRequest, current_user: dict = Depends(get_current_user)):
    prompt = f"""
    You are the SurakshaNet AI Citizen Copilot, an expert in cybersecurity and fraud prevention in India.
    The user is asking: '{request.message}'
    Please respond accurately and helpfully. Keep it concise.
    IMPORTANT: You must respond in the following language code: {request.language} (en=English, hi=Hindi, kn=Kannada, te=Telugu).
    """
    
    response_text = await gemini_service.generate_content(prompt)
    
    db = Database.get_db()
    chat_doc = {
        "user_id": current_user["id"],
        "message": request.message,
        "language": request.language,
        "response": response_text,
        "created_at": datetime.utcnow()
    }
    
    await db["chatbot_history"].insert_one(chat_doc)
    
    return {"reply": response_text}

@router.get("/history")
async def get_chat_history(
    skip: int = 0, 
    limit: int = 20, 
    current_user: dict = Depends(get_current_user)
):
    db = Database.get_db()
    
    query = {"user_id": current_user["id"]}
    cursor = db["chatbot_history"].find(query).sort("created_at", -1).skip(skip).limit(limit)
    history = await cursor.to_list(length=limit)
    
    for item in history:
        item["id"] = str(item["_id"])
        del item["_id"]
        
    total = await db["chatbot_history"].count_documents(query)
    
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": history
    }
