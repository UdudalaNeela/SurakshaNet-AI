from fastapi import APIRouter, Depends, UploadFile, File
import random
from urllib.parse import urlparse
from models.report import ChatRequest
from services.gemini_service import gemini_service
from utils.dependencies import get_current_user

router = APIRouter(prefix="/checker", tags=["Cyber Safety Checkers"])

@router.get("/phone/{number}")
async def check_phone(number: str, current_user: dict = Depends(get_current_user)):
    # Mock data for hackathon (would use Truecaller or Trai API in prod)
    spam_score = random.randint(0, 100)
    reports = random.randint(0, 50) if spam_score > 40 else 0
    
    if spam_score > 70:
        reputation = "Dangerous"
        rec = "Do not answer. Block immediately. High probability of scam."
    elif spam_score > 40:
        reputation = "Suspicious"
        rec = "Proceed with caution. Number has been flagged as spam."
    else:
        reputation = "Safe"
        rec = "No suspicious activity detected for this number."

    return {
        "number": number,
        "spam_score": spam_score,
        "fraud_reports": reports,
        "reputation": reputation,
        "ai_recommendation": rec,
        "previous_complaints": [
            {"date": "2023-10-12", "type": "Financial Fraud"}
        ] if reports > 0 else []
    }

@router.get("/url")
async def check_url(url: str, current_user: dict = Depends(get_current_user)):
    # Mock data for hackathon
    parsed = urlparse(url)
    domain = parsed.netloc or url
    
    is_suspicious = any(word in domain.lower() for word in ["free", "prize", "login", "secure", "update", "verify"])
    
    status = "Dangerous" if is_suspicious else "Safe"
    age = random.randint(1, 30) if is_suspicious else random.randint(300, 3000)
    
    return {
        "url": url,
        "domain": domain,
        "status": status,
        "domain_age_days": age,
        "ssl_certificate": "Valid" if not is_suspicious else "Invalid/Missing",
        "blacklist_status": "Listed in Phishtank" if is_suspicious else "Clean",
        "phishing_indicators": ["Suspicious keywords in domain", "Recently registered domain"] if is_suspicious else []
    }

@router.post("/qr")
async def check_qr(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    # In a real app, use cv2 and pyzbar to decode the QR code image
    # For hackathon, we simulate detecting a payment request QR
    content = await file.read()
    
    # Mock detection
    is_fake = random.choice([True, False])
    
    if is_fake:
        return {
            "status": "Dangerous",
            "detected_url": "upi://pay?pa=scammer@ybl&pn=Customer%20Support&am=50000",
            "analysis": "This QR code contains a payment request (Collect Request). Scanning this and entering your PIN will DEDUCT money from your account, not receive it.",
            "type": "Fake Payment Request"
        }
    else:
        return {
            "status": "Safe",
            "detected_url": "https://www.example.com/menu",
            "analysis": "Standard URL detected. No malicious intent found.",
            "type": "Standard Link"
        }

@router.post("/otp")
async def check_otp(request: ChatRequest, current_user: dict = Depends(get_current_user)):
    prompt = f"""
    The user is asking a safety question about an OTP (One Time Password):
    "{request.message}"
    
    Please explain:
    1. Why it is dangerous to share this OTP.
    2. What common scam this looks like.
    3. Best practices to stay safe.
    
    Keep the response concise, authoritative, and helpful.
    """
    
    response_text = await gemini_service.generate_content(prompt)
    
    return {"analysis": response_text}
