from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from ..models.order_model import Order, OrderCreate
from ..services.order_service import OrderService
from ..dependencies import get_order_service

router = APIRouter(prefix="/api/orders", tags=["orders"])

@router.post("/", response_model=Order)
def create_order(
    order: OrderCreate,
    order_service: OrderService = Depends(get_order_service)
):
    try:
        return order_service.create_order(order)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error creating order: {str(e)}")

@router.post("/from-cart/{user_id}/{cart_id}", response_model=Order)
def create_order_from_cart(
    user_id: str,
    cart_id: str,
    shipping_address: str,
    order_service: OrderService = Depends(get_order_service)
):
    try:
        return order_service.create_order_from_cart(user_id, cart_id, shipping_address)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error creating order from cart: {str(e)}")

@router.get("/{order_id}", response_model=Order)
def get_order(
    order_id: str,
    order_service: OrderService = Depends(get_order_service)
):
    try:
        order = order_service.get_order(order_id)
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
        return order
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error getting order: {str(e)}")

@router.get("/user/{user_id}", response_model=List[Order])
def get_user_orders(
    user_id: str,
    skip: int = 0,
    limit: int = 100,
    order_service: OrderService = Depends(get_order_service)
):
    try:
        return order_service.get_user_orders(user_id, skip, limit)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error getting user orders: {str(e)}")

@router.get("/", response_model=List[Order])
def get_all_orders(
    skip: int = 0,
    limit: int = 100,
    order_service: OrderService = Depends(get_order_service)
):
    try:
        return order_service.get_all_orders(skip, limit)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error getting all orders: {str(e)}")

# @router.put("/{order_id}", response_model=Order)
# def update_order(
#     order_id: str,
#     order: OrderUpdate,
#     order_service: OrderService = Depends(get_order_service)
# ):
#     try:
#         updated_order = order_service.update_order(order_id, order)
#         if not updated_order:
#             raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
#         return updated_order
#     except Exception as e:
#         raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error updating order: {str(e)}")

# @router.put("/{order_id}/status", response_model=Order)
# def update_order_status(
#     order_id: str,
#     status: OrderStatus,
#     order_service: OrderService = Depends(get_order_service)
# ):
#     try:
#         updated_order = order_service.update_order_status(order_id, status)
#         if not updated_order:
#             raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
#         return updated_order
#     except Exception as e:
#         raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error updating order status: {str(e)}")

@router.delete("/{order_id}")
def delete_order(
    order_id: str,
    order_service: OrderService = Depends(get_order_service)
):
    try:
        if not order_service.delete_order(order_id):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
        return {"message": "Order deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error deleting order: {str(e)}")
 