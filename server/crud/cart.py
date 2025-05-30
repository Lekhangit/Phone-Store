from bson import ObjectId
from db.db import cart_collection, product_collection
from models.cart import CartCreate

def add_to_cart(cart: CartCreate):
    # Bổ sung thông tin sản phẩm cho từng item nếu thiếu
    items = []
    for item in cart.items:
        # Nếu thiếu thông tin sản phẩm, tự lấy từ DB
        if not all([getattr(item, k, None) for k in ["name", "brand", "price", "image"]]):
            product = product_collection.find_one({"_id": ObjectId(item.product_id)})
            if product:
                item_data = {
                    "product_id": item.product_id,
                    "quantity": item.quantity,
                    "name": product["name"],
                    "brand": product["brand"],
                    "price": product["price"],
                    "image": product["image"],
                    "rating": product.get("rating"),
                    "stock": product.get("stock"),
                    "sale_price": product.get("sale_price"),
                    "description": product.get("description"),
                }
                items.append(item_data)
        else:
            items.append(item.dict())

    existing = cart_collection.find_one({"user_id": cart.user_id})
    if existing:
        existing_items = existing["items"]
        for new_item in items:
            found = False
            for item in existing_items:
                if item["product_id"] == new_item["product_id"]:
                    # Cập nhật thông tin sản phẩm và tăng số lượng
                    for k in ["name", "brand", "price", "image", "rating", "stock", "sale_price", "description"]:
                        item[k] = new_item[k]
                    item["quantity"] += new_item["quantity"]
                    found = True
                    break
            if not found:
                existing_items.append(new_item)
        cart_collection.update_one({"user_id": cart.user_id}, {"$set": {"items": existing_items}})
        cart_doc = cart_collection.find_one({"user_id": cart.user_id})
    else:
        cart_doc = {
            "user_id": cart.user_id,
            "items": items
        }
        cart_collection.insert_one(cart_doc)
    cart_doc["id"] = str(cart_doc.get("_id", ""))
    cart_doc.pop("_id", None)
    return cart_doc

def get_cart_by_user(user_id: str):
    cart = cart_collection.find_one({"user_id": user_id})
    if cart:
        cart["id"] = str(cart.get("_id", ""))
        cart.pop("_id", None)
    return cart

def clear_cart(user_id: str):
    cart_collection.delete_one({"user_id": user_id})
    return {"msg": "Cart cleared"}