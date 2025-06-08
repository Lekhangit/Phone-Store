from datetime import datetime
from typing import List, Optional
from bson import ObjectId
from pymongo import MongoClient
from ..models.user_model import User, UserCreate, UserUpdate
from ..core.security import get_password_hash

class UserRepository:
    def __init__(self, db: MongoClient): # type: ignore
        self.collection = db.users

    def create(self, user: UserCreate) -> User:
        try:
            now = datetime.utcnow()
            user_dict = user.model_dump()
            user_dict["password"] = get_password_hash(user_dict["password"])
            user_dict.update({
                "created_at": now,
                "updated_at": now,
                "is_active": True
            })
            result = self.collection.insert_one(user_dict)
            return self.get_by_id(str(result.inserted_id))
        except Exception as e:
            print(f"Error creating user: {str(e)}")
            raise

    def get_by_id(self, user_id: str) -> Optional[User]:
        try:
            user = self.collection.find_one({"_id": ObjectId(user_id)})
            if user:
                user["id"] = str(user["_id"])
                return User(**user)
            return None
        except Exception as e:
            print(f"Error getting user by id: {str(e)}")
            return None

    def get_by_email(self, email: str) -> Optional[User]:
        try:
            user = self.collection.find_one({"email": email})
            if user:
                user["id"] = str(user["_id"])
                return User(**user)
            return None
        except Exception as e:
            print(f"Error getting user by email: {str(e)}")
            return None

    def get_all(self, skip: int = 0, limit: int = 100) -> List[User]:
        try:
            cursor = self.collection.find().skip(skip).limit(limit)
            users = list(cursor)
            return [User(**{**u, "id": str(u["_id"])}) for u in users]
        except Exception as e:
            print(f"Error getting all users: {str(e)}")
            return []

    def update(self, user_id: str, user: UserUpdate) -> Optional[User]:
        try:
            update_data = user.model_dump(exclude_unset=True)
            if "password" in update_data:
                update_data["password"] = get_password_hash(update_data["password"])
            update_data["updated_at"] = datetime.utcnow()
            
            result = self.collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": update_data}
            )
            return self.get_by_id(user_id) if result.modified_count > 0 else None
        except Exception as e:
            print(f"Error updating user: {str(e)}")
            return None

    def delete(self, user_id: str) -> bool:
        try:
            result = self.collection.delete_one({"_id": ObjectId(user_id)})
            return result.deleted_count > 0
        except Exception as e:
            print(f"Error deleting user: {str(e)}")
            return False 