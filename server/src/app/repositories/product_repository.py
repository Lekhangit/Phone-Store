from datetime import datetime
from typing import List, Optional
from bson import ObjectId
from pymongo import MongoClient # Changed from motor.motor_asyncio import AsyncIOMotorClient
from ..models.product_model import Product, ProductCreate, ProductUpdate

class ProductRepository:
    def __init__(self, db: MongoClient): # type: ignore
        self.collection = db.product
        print(f"ProductRepository initialized with collection: {self.collection.name}")

    def create(self, product: ProductCreate) -> Product:
        try:
            now = datetime.utcnow()
            product_dict = product.model_dump()
            product_dict.update({
                "created_at": now,
                "updated_at": now
            })
            result = self.collection.insert_one(product_dict)
            return self.get_by_id(str(result.inserted_id))
        except Exception as e:
            print(f"Error creating product: {str(e)}")
            raise

    def get_by_id(self, product_id: str) -> Optional[Product]:
        try:
            product = self.collection.find_one({"_id": ObjectId(product_id)})
            if product:
                product["id"] = str(product["_id"])
                return Product(**product)
            return None
        except Exception as e:
            print(f"Error getting product by id: {str(e)}")
            return None

    def get_by_name(self, name: str) -> Optional[Product]:
        try:
            product = self.collection.find_one({"name": {"$regex": f"^{name}$", "$options": "i"}})
            if product:
                product["id"] = str(product["_id"])
                return Product(**product)
            return None
        except Exception as e:
            print(f"Error getting product by name: {str(e)}")
            return None

    def get_all(self, skip: int = 0, limit: int = 100) -> List[dict]:
        print(f"Attempting to get all products from collection: {self.collection.name}")
        try:
            cursor = self.collection.find().skip(skip).limit(limit)
            products = list(cursor)
            result = [{**p, "id": str(p["_id"]) if "_id" in p else None} for p in products]
            return result
        except Exception as e:
            print(f"Error getting all products: {str(e)}")
            return []

    def update(self, product_id: str, product: ProductUpdate) -> Optional[Product]:
        try:
            update_data = product.model_dump(exclude_unset=True)
            update_data["updated_at"] = datetime.utcnow()
            
            result = self.collection.update_one(
                {"_id": ObjectId(product_id)},
                {"$set": update_data}
            )
            return self.get_by_id(product_id) if result.modified_count > 0 else None
        except Exception as e:
            print(f"Error updating product: {str(e)}")
            return None

    def delete(self, product_id: str) -> bool:
        try:
            result = self.collection.delete_one({"_id": ObjectId(product_id)})
            return result.deleted_count > 0
        except Exception as e:
            print(f"Error deleting product: {str(e)}")
            return False 