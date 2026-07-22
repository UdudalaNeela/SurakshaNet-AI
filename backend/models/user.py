from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=50)
    role: str = Field(default="citizen", pattern="^(citizen|officer|admin)$")

class CitizenCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=50)
    mobile_number: str = Field(..., min_length=10, max_length=15)
    email: EmailStr
    password: str = Field(..., min_length=8)
    confirm_password: str
    state: str
    city: Optional[str] = None
    district: str
    aadhaar: Optional[str] = None

class OfficerCreate(BaseModel):
    officer_id: str
    full_name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    mobile_number: str
    designation: str
    rank: str
    district: str
    state: str
    department: str
    police_station: str
    badge_number: str
    password: str = Field(..., min_length=8)

class OfficerUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    mobile_number: Optional[str] = None
    designation: Optional[str] = None
    rank: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    department: Optional[str] = None
    police_station: Optional[str] = None
    badge_number: Optional[str] = None
    status: Optional[str] = None

class PasswordReset(BaseModel):
    new_password: str = Field(..., min_length=8)


class AdminCreate(BaseModel):
    admin_id: str
    full_name: str
    email: EmailStr
    password: str = Field(..., min_length=8)

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    role: str
    permissions: Optional[List[str]] = None
    created_at: datetime
    
    # Optional fields for different roles
    mobile_number: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None
    district: Optional[str] = None
    aadhaar: Optional[str] = None
    
    officer_id: Optional[str] = None
    designation: Optional[str] = None
    rank: Optional[str] = None
    district: Optional[str] = None
    department: Optional[str] = None
    police_station: Optional[str] = None
    badge_number: Optional[str] = None
    status: Optional[str] = None
    
    admin_id: Optional[str] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    role: str
    officer_id: Optional[str] = None
    admin_id: Optional[str] = None
