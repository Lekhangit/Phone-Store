from fastapi import APIRouter, HTTPException
from crud import order as crud
from models.order import Order, OrderCreate
from crud import cart as cart_crud

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("/", response_model=Order)
def create_order(order: OrderCreate):
    # Lưu order
    new_order = crud.create_order(order)
    # Xóa giỏ hàng sau khi đặt hàng thành công
    cart_crud.clear_cart(order.user_id)
    return new_order

@router.get("/", response_model=list[Order])
def get_orders(skip: int = 0, limit: int = 10):
    # Lấy danh sách đơn hàng từ MongoDB
    orders = crud.get_oders(skip, limit)
    return orders
