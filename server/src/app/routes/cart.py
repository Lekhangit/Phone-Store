from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from ..models.cart_model import Cart, CartCreate, CartUpdate
from ..services.cart_service import CartService
from ..dependencies import get_cart_service

router = APIRouter(prefix="/api/carts", tags=["carts"])

@router.post("/", response_model=Cart)
def create_cart(
    cart: CartCreate,
    cart_service: CartService = Depends(get_cart_service)
):
    try:
        return cart_service.create_cart(cart)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error creating cart: {str(e)}")

@router.get("/{cart_id}", response_model=Cart)
def get_cart(
    cart_id: str,
    cart_service: CartService = Depends(get_cart_service)
):
    try:
        cart = cart_service.get_cart(cart_id)
        if not cart:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart not found")
        return cart
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error getting cart: {str(e)}")

@router.get("/user/{user_id}", response_model=Cart)
def get_user_cart(
    user_id: str,
    cart_service: CartService = Depends(get_cart_service)
):
    try:
        cart = cart_service.get_user_cart(user_id)
        if not cart:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart not found")
        return cart
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error getting user cart: {str(e)}")

@router.put("/{cart_id}", response_model=Cart)
def update_cart(
    cart_id: str,
    cart: CartUpdate,
    cart_service: CartService = Depends(get_cart_service)
):
    try:
        updated_cart = cart_service.update_cart(cart_id, cart)
        if not updated_cart:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart not found")
        return updated_cart
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error updating cart: {str(e)}")

@router.post("/{cart_id}/items/{product_id}")
def add_to_cart(
    cart_id: str,
    product_id: str,
    quantity: int,
    cart_service: CartService = Depends(get_cart_service)
):
    try:
        cart = cart_service.add_to_cart(cart_id, product_id, quantity)
        if not cart:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart not found")
        return cart
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error adding item to cart: {str(e)}")

@router.delete("/{cart_id}/items/{product_id}")
def remove_from_cart(
    cart_id: str,
    product_id: str,
    cart_service: CartService = Depends(get_cart_service)
):
    try:
        cart = cart_service.remove_from_cart(cart_id, product_id)
        if not cart:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart not found")
        return cart
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error removing item from cart: {str(e)}")

@router.delete("/{cart_id}")
def delete_cart(
    cart_id: str,
    cart_service: CartService = Depends(get_cart_service)
):
    try:
        if not cart_service.delete_cart(cart_id):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart not found")
        return {"message": "Cart deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error deleting cart: {str(e)}") 