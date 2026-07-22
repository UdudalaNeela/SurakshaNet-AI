from pydantic import BaseModel
from typing import List
from datetime import datetime

class ChatMessage(BaseModel):
    role: str # 'user' or 'assistant'
    content: str
    language: str = "en"

class ChatRequest(BaseModel):
    message: str
    language: str = "en" # "en", "hi", "kn", "te"

class ReportRequest(BaseModel):
    report_id: str
    type: str # "scam" or "currency"
