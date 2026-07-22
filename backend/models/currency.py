from pydantic import BaseModel
from typing import List
from datetime import datetime

class CurrencyReportResponse(BaseModel):
    id: str
    status: str
    confidence_score: int
    suspicious_regions: List[str]
    explanation: str
    created_at: datetime
