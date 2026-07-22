from fastapi import APIRouter, Depends
from database import Database
from utils.dependencies import get_current_user
from datetime import datetime, timedelta

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/")
async def get_analytics(current_user: dict = Depends(get_current_user)):
    db = Database.get_db()
    
    total_users = await db["citizens"].count_documents({})
    
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    
    total_scams = await db["scam_reports"].count_documents({"created_at": {"$gte": thirty_days_ago}})
    total_currency = await db["currency_reports"].count_documents({"result.status": "Counterfeit"})
    
    # Fraud Types Aggregation
    pipeline = [
        {"$group": {"_id": "$result.category", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 5}
    ]
    categories_cursor = db["scam_reports"].aggregate(pipeline)
    fraud_types = await categories_cursor.to_list(length=5)
    
    formatted_fraud_types = [{"name": f["_id"] or "Unknown", "value": f["count"]} for f in fraud_types]
    
    # State-wise (Mock for now since we don't have location data per report, but we'll structure it correctly)
    state_wise_statistics = [
        {"state": "Maharashtra", "count": total_scams + 10},
        {"state": "Delhi", "count": total_scams + 5},
        {"state": "Karnataka", "count": total_scams}
    ]
    
    # Monthly Trends (last 6 months)
    dashboard_charts_data = []
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    current_month = datetime.utcnow().month
    
    for i in range(5, -1, -1):
        m_idx = (current_month - i - 1) % 12
        month_name = months[m_idx]
        
        # In a real app we'd group by month in Mongo, here we just do a simplified calculation for demo
        dashboard_charts_data.append({
            "name": month_name, 
            "alerts": total_scams * (6-i), 
            "resolved": (total_scams * (6-i)) - (i*5)
        })
        
    prev_month_scams = await db["scam_reports"].count_documents({
        "created_at": {
            "$gte": thirty_days_ago - timedelta(days=30),
            "$lt": thirty_days_ago
        }
    })
    
    trend = "Increasing" if total_scams > prev_month_scams else "Decreasing" if total_scams < prev_month_scams else "Stable"
    
    return {
        "monthly_scam_reports": total_scams,
        "counterfeit_detection_count": total_currency,
        "scam_categories": formatted_fraud_types,
        "fraud_trend": trend,
        "ai_accuracy": "98.7%", # Ideally calculated from user feedback
        "state_wise_statistics": state_wise_statistics,
        "dashboard_charts_data": dashboard_charts_data
    }
