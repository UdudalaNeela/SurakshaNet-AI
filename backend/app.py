import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from database import Database
from routes import auth, dashboard, scam, currency, graph, heatmap, chatbot, reports, health, admin, analytics, checker, complaint, officer
from fastapi import Request, Response
import time
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(
    title="SurakshaNet AI API",
    description="Production-ready FastAPI backend for SurakshaNet AI platform.",
    version="1.0.0"
)

# Rate Limiter setup
limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://localhost:3002", "https://surakshanet.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging Middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    logger.info(f"{request.client.host} - \"{request.method} {request.url.path}\" {response.status_code} - {process_time:.4f}s")
    return response

# Application startup and shutdown events
@app.on_event("startup")
async def startup_db_client():
    try:
        await Database.connect_db()
        await Database.setup_indexes()
    except Exception as e:
        logger.error(f"Database startup failed: {e}")
        # Continue without database; endpoints may handle missing DB at runtime

@app.on_event("shutdown")
async def shutdown_db_client():
    await Database.close_db()

# Include Routers
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(scam.router)
app.include_router(currency.router)
app.include_router(graph.router)
app.include_router(heatmap.router)
app.include_router(chatbot.router)
app.include_router(reports.router)
app.include_router(health.router)
app.include_router(admin.router)
app.include_router(analytics.router)
app.include_router(checker.router)
app.include_router(complaint.router)
app.include_router(officer.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the SurakshaNet AI API"}
