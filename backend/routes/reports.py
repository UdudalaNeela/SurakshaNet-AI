import os
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from models.report import ReportRequest
from database import Database
from services.pdf_service import pdf_service
from utils.dependencies import get_current_user
from bson import ObjectId

router = APIRouter(prefix="/reports", tags=["PDF Report Generator"])

@router.post("/generate")
async def generate_report(request: ReportRequest, current_user: dict = Depends(get_current_user)):
    db = Database.get_db()
    
    collection = "scam_reports" if request.type == "scam" else "currency_reports"
    
    try:
        report_data = await db[collection].find_one({"_id": ObjectId(request.report_id)})
        if not report_data:
            raise HTTPException(status_code=404, detail="Report not found")
            
        # Ensure uploads directory exists
        os.makedirs("uploads", exist_ok=True)
        filepath = f"uploads/report_{request.report_id}.pdf"
        
        # Format data for PDF
        pdf_data = {
            "id": str(report_data["_id"]),
            "summary": report_data.get("input_text", report_data.get("filename", "N/A")),
            "category": report_data["result"].get("category", report_data["result"].get("status", "Unknown")),
            "risk_level": report_data["result"].get("risk_level", "N/A"),
            "probability": report_data["result"].get("probability", report_data["result"].get("confidence_score", 0)),
            "explanation": report_data["result"].get("explanation", ""),
            "recommendations": report_data["result"].get("recommendations", [])
        }
        
        generated_file = pdf_service.generate_incident_report(pdf_data, filepath)
        
        return FileResponse(path=generated_file, filename=f"SurakshaNet_Report_{request.report_id}.pdf", media_type='application/pdf')
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def get_reports(
    skip: int = 0, 
    limit: int = 10,
    current_user: dict = Depends(get_current_user)
):
    db = Database.get_db()
    
    query = {"user_id": current_user["id"]}
    
    # We will search both scam and currency reports and merge them
    scam_cursor = db["scam_reports"].find(query).sort("created_at", -1)
    scam_reports = await scam_cursor.to_list(length=None)
    for r in scam_reports:
        r["type"] = "scam"
        r["id"] = str(r["_id"])
        del r["_id"]
        
    currency_cursor = db["currency_reports"].find(query).sort("created_at", -1)
    currency_reports = await currency_cursor.to_list(length=None)
    for r in currency_reports:
        r["type"] = "currency"
        r["id"] = str(r["_id"])
        del r["_id"]
        
    combined = scam_reports + currency_reports
    combined.sort(key=lambda x: x["created_at"], reverse=True)
    
    total = len(combined)
    paginated = combined[skip : skip + limit]
    
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": paginated
    }

@router.delete("/{type}/{report_id}")
async def delete_report(type: str, report_id: str, current_user: dict = Depends(get_current_user)):
    db = Database.get_db()
    collection = "scam_reports" if type == "scam" else "currency_reports"
    
    try:
        result = await db[collection].delete_one({"_id": ObjectId(report_id), "user_id": current_user["id"]})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Report not found")
        return {"message": "Report deleted successfully"}
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid report ID")

@router.get("/{type}/{report_id}/download")
async def download_report(type: str, report_id: str, current_user: dict = Depends(get_current_user)):
    # Re-use generation logic
    request = ReportRequest(report_id=report_id, type=type)
    return await generate_report(request, current_user)
