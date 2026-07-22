from fastapi import APIRouter, Depends
from services.graph_service import graph_service
from utils.dependencies import get_current_user

router = APIRouter(prefix="/graph", tags=["Fraud Network Intelligence"])

@router.get("/")
async def get_fraud_network(current_user: dict = Depends(get_current_user)):
    # Returns the generated demo network graph data
    return graph_service.generate_demo_network()
