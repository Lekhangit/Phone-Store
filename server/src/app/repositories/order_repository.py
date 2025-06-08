from datetime import datetime
from typing import List, Optional
from bson import ObjectId
from pymongo import MongoClient
from ..models.order_model import Order, OrderCreate

class OrderRepository:
    def __init__(self, db: MongoClient):
        self.collection = db.orders

    def create(self, order: OrderCreate) -> Order:
        try:
            now = datetime.utcnow()
            order_dict = order.model_dump()
            order_dict.update({
                "created_at": now,
                "updated_at": now,
               
            })
            result = self.collection.insert_one(order_dict)
            return self.get_by_id(str(result.inserted_id))
        except Exception as e:
            print(f"Error creating order: {str(e)}")
            raise

    def get_by_id(self, order_id: str) -> Optional[Order]:
        try:
            order = self.collection.find_one({"_id": ObjectId(order_id)})
            if order:
                order["id"] = str(order["_id"])
                return Order(**order)
            return None
        except Exception as e:
            print(f"Error getting order by id: {str(e)}")
            return None

    def get_by_user_id(self, user_id: str, skip: int = 0, limit: int = 100) -> List[Order]:
        try:
            cursor = self.collection.find({"user_id": user_id}).skip(skip).limit(limit)
            orders = list(cursor)
            return [Order(**{**o, "id": str(o["_id"])}) for o in orders]
        except Exception as e:
            print(f"Error getting orders by user id: {str(e)}")
            return []

    def get_all(self, skip: int = 0, limit: int = 100) -> List[Order]:
        try:
            cursor = self.collection.find().skip(skip).limit(limit)
            orders = list(cursor)
            return [Order(**{**o, "id": str(o["_id"])}) for o in orders]
        except Exception as e:
            print(f"Error getting all orders: {str(e)}")
            return []

   

    
    def delete(self, order_id: str) -> bool:
        try:
            result = self.collection.delete_one({"_id": ObjectId(order_id)})
            return result.deleted_count > 0
        except Exception as e:
            print(f"Error deleting order: {str(e)}")
            return False 