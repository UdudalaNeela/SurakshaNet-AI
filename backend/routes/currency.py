from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from database import Database
from utils.dependencies import get_current_user
from services.currency_detector import currency_detector
from datetime import datetime

router = APIRouter(prefix="/currency", tags=["Fake Currency Detection"])

@router.post("/detect")
async def detect_currency(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    allowed_types = ["image/png", "image/jpeg", "image/jpg"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Only PNG and JPEG images are allowed.")
        
    content = await file.read()
    
    result = await currency_detector.analyze_currency(content, file.content_type)
    
    db = Database.get_db()
    report_doc = {
        "user_id": current_user["id"],
        "filename": file.filename,
        "result": result,
        "created_at": datetime.utcnow()
    }
    
    insert_result = await db["currency_reports"].insert_one(report_doc)
    result["id"] = str(insert_result.inserted_id)
    
    return result

@router.get("/history")
async def get_currency_history(
    skip: int = 0, 
    limit: int = 10, 
    status: str = None,
    current_user: dict = Depends(get_current_user)
):
    db = Database.get_db()
    
    query = {"user_id": current_user["id"]}
    if status:
        query["result.status"] = status
        
    cursor = db["currency_reports"].find(query).sort("created_at", -1).skip(skip).limit(limit)
    history = await cursor.to_list(length=limit)
    
    for item in history:
        item["id"] = str(item["_id"])
        del item["_id"]
        
    total = await db["currency_reports"].count_documents(query)
    
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": history
    }
