from pymongo import MongoClient
from core.config import MONGODB_URI, MONGO_DB_NAME

class Database:
    client: MongoClient = None
    db = None

    @classmethod
    def connect_db(cls):
        cls.client = MongoClient(MONGODB_URI)
        cls.db = cls.client[MONGO_DB_NAME]

    @classmethod
    def close_db(cls):
        if cls.client:
            cls.client.close()

    @classmethod
    def get_db(cls):
        return cls.db

# Collections
def get_product_collection():
    return Database.get_db().product

def get_user_collection():
    return Database.get_db().users

def get_cart_collection():
    return Database.get_db().carts

def get_order_collection():
    return Database.get_db().orders