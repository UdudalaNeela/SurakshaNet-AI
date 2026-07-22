from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from database import Database
from models.user import CitizenCreate, UserResponse, Token, LoginRequest
from utils.security import get_password_hash, verify_password, create_access_token
from utils.dependencies import get_current_user
from datetime import datetime
import re
import json
import os

router = APIRouter(prefix="/auth", tags=["Authentication"])

from pydantic import BaseModel, EmailStr

class ForgotPasswordRequest(BaseModel):
    email: EmailStr
    mobile_number: str
    new_password: str

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: CitizenCreate):
    db = Database.get_db()
    
    if user_data.password != user_data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    # Backend validation
    if not re.fullmatch(r"[A-Za-z ]{3,50}", user_data.full_name):
        raise HTTPException(status_code=400, detail="Full name must contain only letters and spaces, 3-50 characters.")
    if not re.fullmatch(r"[6-9]\d{9}", user_data.mobile_number):
        raise HTTPException(status_code=400, detail="Mobile number must be 10 digits starting with 6-9.")
    if user_data.aadhaar and not re.fullmatch(r"\d{12}", user_data.aadhaar):
        raise HTTPException(status_code=400, detail="Aadhaar must be exactly 12 digits.")
    pw = user_data.password
    if len(pw) < 8 or not re.search(r"[A-Z]", pw) or not re.search(r"[a-z]", pw) or not re.search(r"\d", pw) or not re.search(r"[!@#$%^&*]", pw):
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters, include uppercase, lowercase, number, and special character.")
    # Email format validation
    if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", user_data.email):
        raise HTTPException(status_code=400, detail="Invalid email address.")
    # State and district validation
    if not user_data.state:
        raise HTTPException(status_code=400, detail="State is required.")
    if not user_data.district:
        raise HTTPException(status_code=400, detail="District is required.")
    # Verify district belongs to the selected state
    try:
        with open(os.path.join(os.path.dirname(__file__), "..", "data", "india_regions.json")) as f:
            regions = json.load(f)
        state_entry = next((s for s in regions["states"] if s["name"] == user_data.state), None)
        if not state_entry or user_data.district not in state_entry["districts"]:
            raise HTTPException(status_code=400, detail="District does not belong to selected state.")
    except Exception as e:
        raise HTTPException(status_code=500, detail="State/District validation error.")
    # Check if user exists in any collection
    for col in ["citizens", "officers", "admins"]:
        if await db[col].find_one({"email": user_data.email}):
            raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed_password = get_password_hash(user_data.password)
    user_doc = {
        "email": user_data.email,
        "full_name": user_data.full_name,
        "mobile_number": user_data.mobile_number,
        "state": user_data.state,
        "city": user_data.city,
        "district": user_data.district,
        "aadhaar": user_data.aadhaar,
        "hashed_password": hashed_password,
        "role": "citizen",
        "created_at": datetime.utcnow()
    }
    
    result = await db["citizens"].insert_one(user_doc)
    user_doc["id"] = str(result.inserted_id)
    
    return user_doc

@router.post("/login", response_model=Token)
async def login(req: LoginRequest):
    db = Database.get_db()
    
    collection_map = {
        "admin": "admins",
        "officer": "officers",
        "citizen": "citizens"
    }
    
    if req.role not in collection_map:
        raise HTTPException(status_code=400, detail="Invalid role")
        
    col = collection_map[req.role]
    query = {"email": req.email}
    
    if req.role == "officer":
        if not req.officer_id:
            raise HTTPException(status_code=400, detail="Officer ID is required for officer login")
        query["officer_id"] = req.officer_id
    
    user = await db[col].find_one(query)
            
    if not user or not verify_password(req.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    if req.role == "officer" and user.get("status") != "Active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account is awaiting administrator approval."
        )
        
    access_token = create_access_token(data={"sub": user["email"], "role": req.role})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/forgot-password")
async def forgot_password(req: ForgotPasswordRequest):
    db = Database.get_db()
    citizen = await db["citizens"].find_one({"email": req.email, "mobile_number": req.mobile_number})
    if not citizen:
        raise HTTPException(status_code=404, detail="No citizen found matching those details.")
    
    hashed_password = get_password_hash(req.new_password)
    await db["citizens"].update_one(
        {"_id": citizen["_id"]},
        {"$set": {"hashed_password": hashed_password}}
    )
    return {"message": "Password updated successfully"}


@router.get("/profile", response_model=UserResponse)
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user
