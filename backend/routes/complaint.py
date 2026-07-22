from fastapi import APIRouter, Depends, HTTPException
from models.complaint import ComplaintCreate, ComplaintResponse
from database import Database
from utils.dependencies import get_current_user
from datetime import datetime
import random
import string

router = APIRouter(prefix="/complaint", tags=["Cyber Crime Reporting"])

def generate_case_id():
    suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"SNet-{datetime.utcnow().year}-{suffix}"

@router.post("/report", response_model=ComplaintResponse)
async def report_crime(complaint: ComplaintCreate, current_user: dict = Depends(get_current_user)):
    db = Database.get_db()
    
    case_id = generate_case_id()
    
    complaint_doc = complaint.dict()
    complaint_doc["user_id"] = current_user["id"]
    complaint_doc["case_id"] = case_id
    complaint_doc["status"] = "Submitted"
    complaint_doc["created_at"] = datetime.utcnow()
    complaint_doc["officer_assigned"] = "Pending Assignment"
    complaint_doc["progress"] = 10
    complaint_doc["remarks"] = ["Complaint successfully registered in the SurakshaNet portal."]
    
    await db["complaints"].insert_one(complaint_doc)
    
    return ComplaintResponse(**complaint_doc)

@router.get("/track/{case_id}", response_model=ComplaintResponse)
async def track_complaint(case_id: str, current_user: dict = Depends(get_current_user)):
    db = Database.get_db()
    
    complaint_doc = await db["complaints"].find_one({"case_id": case_id, "user_id": current_user["id"]})
    if not complaint_doc:
        raise HTTPException(status_code=404, detail="Complaint not found or unauthorized access.")
        
    return ComplaintResponse(**complaint_doc)
