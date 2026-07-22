from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class ScamReportRequest(BaseModel):
    text: str = Field(..., min_length=10, description="The text to analyze for scams")
    source: str = Field(default="text", description="Source of the text")

class ScamReportResponse(BaseModel):
    id: str
    probability: int
    category: str
    risk_level: str
    confidence: int
    explanation: str
    recommendations: List[str]
    created_at: datetime
