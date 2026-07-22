from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from database import Database
from utils.dependencies import get_current_officer
from services.gemini_service import gemini_service
from typing import List, Optional

router = APIRouter(prefix="/officer", tags=["Officer Portal"])

class CaseUpdate(BaseModel):
    status: Optional[str] = None
    officer_assigned: Optional[str] = None
    remark: Optional[str] = None

@router.get("/dashboard")
async def get_dashboard(current_officer: dict = Depends(get_current_officer)):
    db = Database.get_db()
    
    pipeline = [
        {"$group": {
            "_id": "$status",
            "count": {"$sum": 1},
            "total_lost": {"$sum": "$amount_lost"}
        }}
    ]
    
    results = await db["complaints"].aggregate(pipeline).to_list(length=10)
    
    stats = {
        "new": 0,
        "pending": 0,
        "closed": 0,
        "total_lost": 0
    }
    
    for res in results:
        status = res["_id"].lower()
        if "submitted" in status or "new" in status:
            stats["new"] += res["count"]
        elif "close" in status or "resolved" in status:
            stats["closed"] += res["count"]
        else:
            stats["pending"] += res["count"]
            
        stats["total_lost"] += res.get("total_lost", 0)
        
    return stats

@router.get("/cases")
async def get_cases(current_officer: dict = Depends(get_current_officer)):
    db = Database.get_db()
    cursor = db["complaints"].find({}).sort("created_at", -1).limit(100)
    cases = await cursor.to_list(length=100)
    for case in cases:
        case["_id"] = str(case["_id"])
    return {"cases": cases}

@router.get("/cases/{case_id}")
async def get_case(case_id: str, current_officer: dict = Depends(get_current_officer)):
    db = Database.get_db()
    case = await db["complaints"].find_one({"case_id": case_id})
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    case["_id"] = str(case["_id"])
    return case

@router.get("/cases/{case_id}/network")
async def get_case_network(case_id: str, current_officer: dict = Depends(get_current_officer)):
    db = Database.get_db()
    source_case = await db["complaints"].find_one({"case_id": case_id})
    if not source_case:
        raise HTTPException(status_code=404, detail="Case not found")
        
    # Build query to find matching attributes
    or_conditions = []
    
    if source_case.get("suspect_phone"):
        or_conditions.append({"suspect_phone": source_case["suspect_phone"]})
    if source_case.get("upi_id"):
        or_conditions.append({"upi_id": source_case["upi_id"]})
    if source_case.get("bank_name"):
        or_conditions.append({"bank_name": source_case["bank_name"]})
    if source_case.get("suspect_website"):
        or_conditions.append({"suspect_website": source_case["suspect_website"]})
        
    if not or_conditions:
        return {"network": []}
        
    cursor = db["complaints"].find({
        "$and": [
            {"case_id": {"$ne": case_id}},
            {"$or": or_conditions}
        ]
    })
    
    network_cases = await cursor.to_list(length=50)
    for case in network_cases:
        case["_id"] = str(case["_id"])
        
    return {"network": network_cases}

@router.put("/cases/{case_id}")
async def update_case(case_id: str, update_data: CaseUpdate, current_officer: dict = Depends(get_current_officer)):
    db = Database.get_db()
    
    update_doc = {}
    if update_data.status:
        update_doc["status"] = update_data.status
        if update_data.status == "Under Investigation":
            update_doc["progress"] = 50
        elif update_data.status == "Closed":
            update_doc["progress"] = 100
            
    if update_data.officer_assigned:
        update_doc["officer_assigned"] = update_data.officer_assigned
        
    if not update_doc and not update_data.remark:
        return {"message": "No updates provided"}
        
    db_ops = {}
    if update_doc:
        db_ops["$set"] = update_doc
    if update_data.remark:
        db_ops["$push"] = {"remarks": update_data.remark}
        
    await db["complaints"].update_one({"case_id": case_id}, db_ops)
    return {"message": "Case updated successfully"}

@router.post("/cases/{case_id}/generate-fir")
async def generate_fir(case_id: str, current_officer: dict = Depends(get_current_officer)):
    db = Database.get_db()
    case = await db["complaints"].find_one({"case_id": case_id})
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
        
    prompt = f"""
    Act as a Cyber Police Officer. Write an official First Information Report (FIR) summary based on the following victim statement and data.
    Do not invent facts. Use a formal, legal tone.
    
    Case ID: {case['case_id']}
    Victim: {case.get('name')}
    Contact: {case.get('phone_number')}
    Scam Type: {case.get('scam_type')}
    Amount Lost: INR {case.get('amount_lost', 0)}
    Incident Description: {case.get('description')}
    Suspect Phone: {case.get('suspect_phone', 'N/A')}
    Suspect UPI: {case.get('upi_id', 'N/A')}
    """
    
    fir_text = await gemini_service.generate_content(prompt)
    
    return {"fir_content": fir_text}
