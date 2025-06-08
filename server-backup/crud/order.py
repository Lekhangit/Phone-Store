# from bson import ObjectId
# from db.db import order_collection, cart_collection
# from models.order import OrderCreate

# def get_oders(skip: int = 0, limit: int = 10):
#     # Lấy danh sách đơn hàng từ MongoDB
#     orders = order_collection.find().skip(skip).limit(limit)
#     return [{**o, "id": str(o["_id"])} for o in orders]

# def create_order(order: OrderCreate):
#     # Lấy cart của user để lấy đầy đủ thông tin sản phẩm
#     cart = cart_collection.find_one({"user_id": order.user_id})
#     if cart:
#         order_dict = {
#             "user_id": order.user_id,
#             "items": cart["items"]  # Lưu toàn bộ thông tin sản phẩm từ cart
#         }
#         result = order_collection.insert_one(order_dict)
#         new_order = order_collection.find_one({"_id": result.inserted_id})
#         new_order["id"] = str(new_order["_id"])
#         return new_order
#     return None