from pydantic import BaseModel, EmailStr
 
class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict
 
class TokenData(BaseModel):
    email: str | None = None
 
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "user"
 
class UserLogin(BaseModel):
    email: EmailStr
    password: str