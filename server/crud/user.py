from bson import ObjectId
from db.db import user_collection
from models.user import UserCreate, UserUpdate

def get_users(skip: int = 0, limit: int = 10):
    users = user_collection.find().skip(skip).limit(limit)
    return [{**u, "id": str(u["_id"])} for u in users]


def get_user_by_username(username: str):
    user = user_collection.find_one({"username": username})
    if user:
        user["id"] = str(user["_id"])
        user.pop("_id", None)  # Xóa trường _id để tránh lỗi serialize
    return user

def create_user(user: UserCreate):
    result = user_collection.insert_one(user.dict())
    new_user = user_collection.find_one({"_id": result.inserted_id})
    new_user["id"] = str(new_user["_id"])
    new_user.pop("_id", None)
    return new_user

def update_user(user_id: str, user_data: UserUpdate):
    updated = user_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": user_data.dict()}
    )
    if updated.modified_count:
        user = user_collection.find_one({"_id": ObjectId(user_id)})
        if user:
            user["id"] = str(user["_id"])
            user.pop("_id", None)
        return user
    return None

def delete_user(user_id: str):
    deleted = user_collection.find_one_and_delete({"_id": ObjectId(user_id)})
    if deleted:
        deleted["id"] = str(deleted["_id"])
        deleted.pop("_id", None)
    return deleted