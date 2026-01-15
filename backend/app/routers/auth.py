from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.auth import UserRegister, Token
from app.services.auth_service import AuthService
 
router = APIRouter(prefix="/api/auth", tags=["Authentication"])
 
@router.post("/register", response_model=dict)
async def register(user_data: UserRegister):
    """Register a new user"""
    return AuthService.register_user(
        name=user_data.name,
        email=user_data.email,
        password=user_data.password,
        role=user_data.role
    )
 
@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login with username (email) and password"""
    return AuthService.authenticate_user(
        email=form_data.username,  # OAuth2 uses 'username' field
        password=form_data.password
    )