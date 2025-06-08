from datetime import datetime
from typing import List, Optional
from bson import ObjectId
from pymongo import MongoClient
from ..models.cart_model import Cart, CartCreate, CartUpdate, CartItem

class CartRepository:
    def __init__(self, db: MongoClient): # type: ignore
        self.collection = db.carts

    def create(self, cart: CartCreate) -> Cart:
        try:
            now = datetime.utcnow()
            cart_dict = cart.model_dump()
            cart_dict.update({
                "created_at": now,
                "updated_at": now,
                "total": sum(item.price * item.quantity for item in cart.items)
            })
            result = self.collection.insert_one(cart_dict)
            return self.get_by_id(str(result.inserted_id))
        except Exception as e:
            print(f"Error creating cart: {str(e)}")
            raise

    def get_by_id(self, cart_id: str) -> Optional[Cart]:
        try:
            cart = self.collection.find_one({"_id": ObjectId(cart_id)})
            if cart:
                cart["id"] = str(cart["_id"])
                return Cart(**cart)
            return None
        except Exception as e:
            print(f"Error getting cart by id: {str(e)}")
            return None

    def get_by_user_id(self, user_id: str) -> Optional[Cart]:
        try:
            cart = self.collection.find_one({"user_id": user_id})
            if cart:
                cart["id"] = str(cart["_id"])
                return Cart(**cart)
            return None
        except Exception as e:
            print(f"Error getting cart by user id: {str(e)}")
            return None

    def update(self, cart_id: str, cart: CartUpdate) -> Optional[Cart]:
        try:
            update_data = cart.model_dump(exclude_unset=True)
            if "items" in update_data:
                update_data["total"] = sum(item.price * item.quantity for item in update_data["items"])
            update_data["updated_at"] = datetime.utcnow()
            
            result = self.collection.update_one(
                {"_id": ObjectId(cart_id)},
                {"$set": update_data}
            )
            return self.get_by_id(cart_id) if result.modified_count > 0 else None
        except Exception as e:
            print(f"Error updating cart: {str(e)}")
            return None

    def add_item(self, cart_id: str, item: CartItem) -> Optional[Cart]:
        try:
            cart = self.get_by_id(cart_id)
            if not cart:
                return None

            # Update existing item or add new one
            items = cart.items
            for i, existing_item in enumerate(items):
                if existing_item.product_id == item.product_id:
                    items[i] = item
                    break
            else:
                items.append(item)

            update_data = {
                "items": [item.model_dump() for item in items],
                "total": sum(item.price * item.quantity for item in items),
                "updated_at": datetime.utcnow()
            }

            result = self.collection.update_one(
                {"_id": ObjectId(cart_id)},
                {"$set": update_data}
            )
            return self.get_by_id(cart_id) if result.modified_count > 0 else None
        except Exception as e:
            print(f"Error adding item to cart: {str(e)}")
            return None

    def remove_item(self, cart_id: str, product_id: str) -> Optional[Cart]:
        try:
            cart = self.get_by_id(cart_id)
            if not cart:
                return None

            items = [item for item in cart.items if item.product_id != product_id]
            update_data = {
                "items": [item.model_dump() for item in items],
                "total": sum(item.price * item.quantity for item in items),
                "updated_at": datetime.utcnow()
            }

            result = self.collection.update_one(
                {"_id": ObjectId(cart_id)},
                {"$set": update_data}
            )
            return self.get_by_id(cart_id) if result.modified_count > 0 else None
        except Exception as e:
            print(f"Error removing item from cart: {str(e)}")
            return None

    def delete(self, cart_id: str) -> bool:
        try:
            result = self.collection.delete_one({"_id": ObjectId(cart_id)})
            return result.deleted_count > 0
        except Exception as e:
            print(f"Error deleting cart: {str(e)}")
            return False 