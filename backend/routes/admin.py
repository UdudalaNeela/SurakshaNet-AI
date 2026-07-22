from fastapi import APIRouter, Depends, HTTPException, status
from database import Database
from utils.dependencies import get_current_admin
from bson import ObjectId
from models.user import OfficerCreate, OfficerUpdate, PasswordReset, UserResponse
from utils.security import get_password_hash
from datetime import datetime

router = APIRouter(prefix="/admin", tags=["Admin Module"])

@router.get("/officers")
async def get_officers(skip: int = 0, limit: int = 50, current_admin: dict = Depends(get_current_admin)):
    db = Database.get_db()
    cursor = db["officers"].find({}, {"hashed_password": 0}).skip(skip).limit(limit)
    officers = await cursor.to_list(length=limit)
    
    for officer in officers:
        officer["id"] = str(officer["_id"])
        del officer["_id"]
        
    return {"officers": officers}

@router.post("/officers", status_code=status.HTTP_201_CREATED)
async def create_officer(officer_data: OfficerCreate, current_admin: dict = Depends(get_current_admin)):
    db = Database.get_db()
    
    for col in ["citizens", "officers", "admins"]:
        if await db[col].find_one({"email": officer_data.email}):
            raise HTTPException(status_code=400, detail="Email already registered")
            
    if await db["officers"].find_one({"officer_id": officer_data.officer_id}):
        raise HTTPException(status_code=400, detail="Officer ID already exists")

    hashed_password = get_password_hash(officer_data.password)
    officer_doc = officer_data.model_dump(exclude={"password"})
    officer_doc["hashed_password"] = hashed_password
    officer_doc["role"] = "officer"
    officer_doc["status"] = "Active"
    officer_doc["created_at"] = datetime.utcnow()
    
    result = await db["officers"].insert_one(officer_doc)
    officer_doc["id"] = str(result.inserted_id)
    del officer_doc["hashed_password"]
    if "_id" in officer_doc:
        del officer_doc["_id"]
    
    return officer_doc

@router.put("/officers/{officer_id}/suspend")
async def suspend_officer(officer_id: str, current_admin: dict = Depends(get_current_admin)):
    db = Database.get_db()
    result = await db["officers"].update_one(
        {"officer_id": officer_id},
        {"$set": {"status": "Suspended"}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Officer not found or already suspended")
    return {"message": "Officer suspended successfully"}

@router.put("/officers/{officer_id}")
async def update_officer(officer_id: str, officer_data: OfficerUpdate, current_admin: dict = Depends(get_current_admin)):
    db = Database.get_db()
    
    update_data = {k: v for k, v in officer_data.model_dump().items() if v is not None}
    if not update_data:
        return {"message": "No changes provided"}
        
    result = await db["officers"].update_one(
        {"officer_id": officer_id},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Officer not found")
    return {"message": "Officer updated successfully"}

@router.put("/officers/{officer_id}/reset-password")
async def reset_officer_password(officer_id: str, password_data: PasswordReset, current_admin: dict = Depends(get_current_admin)):
    db = Database.get_db()
    hashed_password = get_password_hash(password_data.new_password)
    
    result = await db["officers"].update_one(
        {"officer_id": officer_id},
        {"$set": {"hashed_password": hashed_password}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Officer not found")
    return {"message": "Password reset successfully"}


@router.delete("/officers/{officer_id}")
async def delete_officer(officer_id: str, current_admin: dict = Depends(get_current_admin)):
    db = Database.get_db()
    result = await db["officers"].delete_one({"officer_id": officer_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Officer not found")
    return {"message": "Officer deleted successfully"}

@router.get("/analytics")
async def get_admin_analytics(current_admin: dict = Depends(get_current_admin)):
    db = Database.get_db()
    
    total_users = await db["citizens"].count_documents({})
    total_officers = await db["officers"].count_documents({})
    
    pipeline = [
        {"$group": {
            "_id": None,
            "total_lost": {"$sum": "$amount_lost"},
            "total_cases": {"$sum": 1}
        }}
    ]
    complaints_stats = await db["complaints"].aggregate(pipeline).to_list(length=1)
    
    stats = complaints_stats[0] if complaints_stats else {"total_lost": 0, "total_cases": 0}
    
    return {
        "total_users": total_users,
        "total_officers": total_officers,
        "total_complaints": stats["total_cases"],
        "total_money_lost": stats["total_lost"],
        "platform_health": "Optimal"
    }

@router.put("/officers/{officer_id}/approve")
async def approve_officer(officer_id: str, current_admin: dict = Depends(get_current_admin)):
    db = Database.get_db()
    result = await db["officers"].update_one(
        {"officer_id": officer_id},
        {"$set": {"status": "Active"}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Officer not found")
    return {"message": "Officer approved successfully"}

@router.put("/officers/{officer_id}/disable")
async def disable_officer(officer_id: str, current_admin: dict = Depends(get_current_admin)):
    db = Database.get_db()
    result = await db["officers"].update_one(
        {"officer_id": officer_id},
        {"$set": {"status": "Disabled"}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Officer not found")
    return {"message": "Officer disabled successfully"}

@router.get("/citizens")
async def get_citizens(skip: int = 0, limit: int = 100, current_admin: dict = Depends(get_current_admin)):
    db = Database.get_db()
    cursor = db["citizens"].find({}, {"hashed_password": 0}).skip(skip).limit(limit)
    citizens = await cursor.to_list(length=limit)
    for citizen in citizens:
        citizen["id"] = str(citizen["_id"])
        del citizen["_id"]
    return {"citizens": citizens}

@router.get("/cases")
async def get_cases(skip: int = 0, limit: int = 100, current_admin: dict = Depends(get_current_admin)):
    db = Database.get_db()
    cursor = db["complaints"].find({}).sort("created_at", -1).skip(skip).limit(limit)
    cases = await cursor.to_list(length=limit)
    for case in cases:
        case["_id"] = str(case["_id"])
    return {"cases": cases}
