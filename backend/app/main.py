from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, admin, user
from app.database import init_db
 
app = FastAPI(title="Smart Task Manager API", version="1.0.0")
 
# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
 
# Include routers - IMPORTANT: Make sure these are here
app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(user.router)
 
@app.on_event("startup")
async def startup_event():
    init_db()
    print("✅ Application started successfully")
    print("📋 API Documentation: http://localhost:8000/docs")
 
@app.get("/")
async def root():
    return {
        "message": "Smart Task Manager API",
        "status": "running",
        "docs": "http://localhost:8000/docs"
    }
 
@app.get("/health")
async def health_check():
    return {"status": "healthy"}