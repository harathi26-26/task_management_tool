from datetime import datetime, timedelta
from app.database import get_db
from app.utils.security import verify_password, get_password_hash, create_access_token
from app.config import settings
from fastapi import HTTPException, status
 
class AuthService:
    @staticmethod
    def register_user(name: str, email: str, password: str, role: str = "user"):
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Check if user exists
            cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
            if cursor.fetchone():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered"
                )
            
            # Only allow admin creation through special utility
            # Regular registration always creates users
            if role == "admin":
                role = "user"  # Force to user role
                is_superuser = 0
            else:
                is_superuser = 0
            
            # Create user
            hashed_password = get_password_hash(password)
            now = datetime.utcnow().isoformat()
            
            cursor.execute("""
                INSERT INTO users (name, email, hashed_password, role, is_superuser, is_active, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (name, email, hashed_password, role, is_superuser, 1, now, now))
            
            user_id = cursor.lastrowid
            
            cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
            user = dict(cursor.fetchone())
            
            return {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "role": user["role"],
                "is_superuser": bool(user.get("is_superuser", 0))
            }
    
    @staticmethod
    def authenticate_user(email: str, password: str):
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
            user = cursor.fetchone()
            
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Incorrect email or password"
                )
            
            user_dict = dict(user)
            
            # Check if user is active
            if not user_dict.get("is_active", 1):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="User account is disabled"
                )
            
            if not verify_password(password, user_dict["hashed_password"]):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Incorrect email or password"
                )
            
            # Update last login
            now = datetime.utcnow().isoformat()
            cursor.execute("UPDATE users SET last_login = ? WHERE id = ?", (now, user_dict["id"]))
            
            # Create access token with additional claims
            access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(
                data={
                    "sub": user_dict["email"],
                    "role": user_dict["role"],
                    "is_superuser": bool(user_dict.get("is_superuser", 0))
                },
                expires_delta=access_token_expires
            )
            
            return {
                "access_token": access_token,
                "token_type": "bearer",
                "user": {
                    "id": user_dict["id"],
                    "name": user_dict["name"],
                    "email": user_dict["email"],
                    "role": user_dict["role"],
                    "is_superuser": bool(user_dict.get("is_superuser", 0)),
                    "last_login": now
                }
            }