from pymongo import MongoClient
from core.config import MONGODB_URI, MONGO_DB_NAME

client = MongoClient(MONGODB_URI)
db = client[MONGO_DB_NAME]

product_collection = db["product"]
user_collection = db["user"]
order_collection = db["order"]
cart_collection = db["cart"]