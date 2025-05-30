from fastapi import APIRouter, HTTPException
from crud import user as crud
from models.user import User, UserCreate, UserUpdate

router = APIRouter(prefix="/user", tags=["User"])

@router.get("/", response_model=list[User])
def read_users(skip: int = 0, limit: int = 10):
    return crud.get_users(skip, limit)

@router.get("/{user_id}", response_model=User)
def read_user(user_id: str):
    user = crud.get_user_by_username(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
from fastapi import Body

@router.post("/login")
def login(data: dict = Body(...)):
    username = data.get("username")
    password = data.get("password")
    user = crud.get_user_by_username(username)  # Sửa dòng này!
    if not user or user["password"] != password:
        raise HTTPException(status_code=401, detail="Sai tài khoản hoặc mật khẩu")
    return user

@router.post("/", response_model=User)
def create_user(user: UserCreate):
    return crud.create_user(user)

@router.put("/{user_id}", response_model= User)
def update_user(user_id: str, user: UserUpdate):
    updated = crud.update_user(user_id, user)
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    return updated  

@router.delete("/{user_id}", response_model = User)
def delete_user(user_id:str):
    deleted = crud.delete_user(user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")
    return deleted