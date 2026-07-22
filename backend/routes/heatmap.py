from fastapi import APIRouter, Depends
from utils.dependencies import get_current_user
import random

router = APIRouter(prefix="/heatmap", tags=["India Crime Heatmap"])

@router.get("/")
async def get_heatmap_data(current_user: dict = Depends(get_current_user)):
    # Demo geospatial data for India
    hotspots = [
        { "id": 1, "lat": 28.6139, "lng": 77.2090, "city": "New Delhi", "intensity": 0.9, "cases": 450, "type": "Digital Arrest" },
        { "id": 2, "lat": 19.0760, "lng": 72.8777, "city": "Mumbai", "intensity": 0.85, "cases": 412, "type": "UPI Fraud" },
        { "id": 3, "lat": 12.9716, "lng": 77.5946, "city": "Bengaluru", "intensity": 0.7, "cases": 320, "type": "Fake Job Scam" },
        { "id": 4, "lat": 23.8315, "lng": 91.2868, "city": "Agartala", "intensity": 0.95, "cases": 510, "type": "Phishing Hub" },
        { "id": 5, "lat": 26.9124, "lng": 75.7873, "city": "Jaipur", "intensity": 0.6, "cases": 210, "type": "Counterfeit" },
    ]
        
    return {"hotspots": hotspots}
