from fastapi import APIRouter, HTTPException, Body
from crud import cart as crud
from models.cart import Cart, CartCreate, CartUpdate

router = APIRouter(prefix="/cart", tags=["Cart"])

@router.post("/", response_model=Cart)
def add_to_cart(cart: CartCreate):
    return crud.add_to_cart(cart)

@router.get("/{user_id}", response_model=Cart)
def get_cart(user_id: str):
    cart = crud.get_cart_by_user(user_id)
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    return cart

@router.delete("/{user_id}")
def clear_cart(user_id: str):
    return crud.clear_cart(user_id)