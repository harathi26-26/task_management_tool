from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
 
class User(BaseModel):
    id: Optional[int] = None
    name: str
    email: EmailStr
    role: str = "user"
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
 
class UserInDB(User):
    hashed_password: str