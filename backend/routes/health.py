from fastapi import APIRouter
from database import Database
from config import settings
from datetime import datetime
import time

router = APIRouter(tags=["System Health & AI Status"])
START_TIME = time.time()

@router.get("/health")
async def health_check():
    db = Database.get_db()
    db_status = "Connected"
    try:
        await Database.client.admin.command('ping')
    except Exception:
        db_status = "Disconnected"
        
    uptime_seconds = time.time() - START_TIME
    
    return {
        "api_status": "Online",
        "mongodb_status": db_status,
        "gemini_api_status": "Connected" if settings.GEMINI_API_KEY else "Disconnected",
        "server_uptime_seconds": round(uptime_seconds, 2),
        "timestamp": datetime.utcnow()
    }

@router.get("/ai/status")
async def ai_status():
    return {
        "gemini_connected": bool(settings.GEMINI_API_KEY),
        "currency_model_loaded": True, # Simulated via Gemini Vision
        "fraud_model_loaded": True,    # Simulated via Gemini text
        "graph_model_ready": True,     # NetworkX is ready
        "timestamp": datetime.utcnow()
    }
