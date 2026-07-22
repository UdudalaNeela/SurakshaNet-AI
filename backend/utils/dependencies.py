from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from config import settings
from database import Database
from models.user import TokenData
from bson import ObjectId

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        email: str = payload.get("sub")
        role: str = payload.get("role")
        if email is None or role is None:
            raise credentials_exception
        token_data = TokenData(email=email, role=role)
    except (JWTError, ValidationError):
        raise credentials_exception
        
    db = Database.get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database connection failed")
        
    collection_map = {
        "admin": "admins",
        "officer": "officers",
        "citizen": "citizens"
    }
    col_name = collection_map.get(token_data.role)
    if not col_name:
        raise credentials_exception

    user = await db[col_name].find_one({"email": token_data.email})
    if user is None:
        raise credentials_exception
        
    user["id"] = str(user["_id"])
    user["role"] = token_data.role
    
    role_doc = await db["roles"].find_one({"name": token_data.role})
    if role_doc:
        user["permissions"] = role_doc.get("permissions", [])
    else:
        user["permissions"] = []
        
    return user

async def get_current_admin(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough privileges"
        )
    return current_user

async def get_current_officer(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") not in ["admin", "officer"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough privileges. Officer access required."
        )
    return current_user
