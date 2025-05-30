from bson import ObjectId
from db.db import product_collection
from models.product import ProductCreate, ProductUpdate

def get_products(skip: int = 0, limit: int = 10):
    products = product_collection.find().skip(skip).limit(limit)
    return [{**p, "id": str(p["_id"])} for p in products]

def get_product(product_id: str):
    product = product_collection.find_one({"_id": ObjectId(product_id)})
    if product:
        product["id"] = str(product["_id"])
    return product

def get_product_by_name(name: str):
    """
    Get product by name (case-insensitive)
    """
    product = product_collection.find_one({"name": {"$regex": f"^{name}$", "$options": "i"}})
    if product:
        product["id"] = str(product["_id"])
    return product

def create_product(product: ProductCreate):
    result = product_collection.insert_one(product.dict())
    new_product = product_collection.find_one({"_id": result.inserted_id})
    new_product["id"] = str(new_product["_id"])
    return new_product

def update_product(product_id: str, product_data: ProductUpdate):
    updated = product_collection.update_one(
        {"_id": ObjectId(product_id)},
        {"$set": product_data.dict()}
    )
    if updated.modified_count:
        return get_product(product_id)
    return None

def delete_product(product_id: str):
    deleted = product_collection.find_one_and_delete({"_id": ObjectId(product_id)})
    if deleted:
        deleted["id"] = str(deleted["_id"])
    return deleted
