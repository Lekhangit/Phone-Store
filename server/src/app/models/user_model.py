from pydantic import BaseModel
from bson import ObjectId

class UserBase(BaseModel):
    username: str
    password: str

class UserCreate(UserBase):
    pass
class UserUpdate(BaseModel):
     password: str
class User(UserBase):
    id: str

    class Config:
        orm_mode = True

