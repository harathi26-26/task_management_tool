from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
from app.config import settings
import hashlib

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    """
    Hash a password safely with bcrypt.
    Uses SHA256 first to handle passwords of any length.
    """
    # Step 1: Convert password to SHA256 hex digest (64 bytes)
    sha_password = hashlib.sha256(password.encode("utf-8")).hexdigest()
    # Step 2: Hash with bcrypt
    return pwd_context.hash(sha_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against a hashed value.
    SHA256 hash first, then verify using bcrypt.
    """
    sha_password = hashlib.sha256(plain_password.encode("utf-8")).hexdigest()
    return pwd_context.verify(sha_password, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token with expiration.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """
    Decode a JWT token and return the payload.
    Returns None if token is invalid or expired.
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None
