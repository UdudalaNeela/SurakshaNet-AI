from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime

class ComplaintCreate(BaseModel):
    name: str = Field(..., min_length=2)
    phone_number: str = Field(..., min_length=10)
    email: EmailStr
    state: str
    city: str
    scam_type: str
    description: str = Field(..., min_length=10)
    amount_lost: float
    bank_name: Optional[str] = None
    upi_id: Optional[str] = None
    transaction_id: Optional[str] = None
    suspect_phone: Optional[str] = None
    suspect_website: Optional[str] = None
    
class ComplaintResponse(BaseModel):
    case_id: str
    status: str
    created_at: datetime
    officer_assigned: Optional[str] = None
    progress: int
    remarks: List[str]
