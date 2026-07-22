from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
import json
from database import Database
from utils.dependencies import get_current_user
from services.scam_detector import scam_detector
from datetime import datetime

router = APIRouter(prefix="/scam", tags=["Scam Detection"])

@router.post("/detect-text")
async def detect_scam_text(text: str = Form(...), current_user: dict = Depends(get_current_user)):
    result = await scam_detector.analyze_text(text)
    
    db = Database.get_db()
    report_doc = {
        "user_id": current_user["id"],
        "input_text": text,
        "result": result,
        "created_at": datetime.utcnow()
    }
    
    insert_result = await db["scam_reports"].insert_one(report_doc)
    result["id"] = str(insert_result.inserted_id)
    
    return result

@router.post("/detect-file")
async def detect_scam_file(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    allowed_types = ["application/pdf", "image/png", "image/jpeg"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF, PNG, and JPEG are allowed.")
    
    # In a real scenario, we'd extract text from the PDF/Image first using OCR/PyPDF2.
    # For now, we mock the extraction and send it to the detector.
    content = await file.read()
    mock_extracted_text = f"Extracted text from {file.filename}: URGENT Your account is blocked. Pay 50000 immediately."
    
    result = await scam_detector.analyze_text(mock_extracted_text)
    
    db = Database.get_db()
    report_doc = {
        "user_id": current_user["id"],
        "filename": file.filename,
        "result": result,
        "created_at": datetime.utcnow()
    }
    
    insert_result = await db["scam_reports"].insert_one(report_doc)
    result["id"] = str(insert_result.inserted_id)
    
    return result

@router.get("/history")
async def get_scam_history(
    skip: int = 0, 
    limit: int = 10, 
    category: str = None,
    current_user: dict = Depends(get_current_user)
):
    db = Database.get_db()
    
    query = {"user_id": current_user["id"]}
    if category:
        query["result.category"] = category
        
    cursor = db["scam_reports"].find(query).sort("created_at", -1).skip(skip).limit(limit)
    history = await cursor.to_list(length=limit)
    
    # Format IDs
    for item in history:
        item["id"] = str(item["_id"])
        del item["_id"]
        
    total = await db["scam_reports"].count_documents(query)
    
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": history
    }
