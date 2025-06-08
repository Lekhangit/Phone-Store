from pydantic import BaseModel
from typing import List, Optional

class CartItem(BaseModel):
    product_id: str
    quantity: int
    name: Optional[str] = None
    brand: Optional[str] = None
    price: Optional[float] = None
    image: Optional[str] = None
    rating: Optional[float] = None
    stock: Optional[int] = None
    sale_price: Optional[float] = None
    description: Optional[str] = None

class CartCreate(BaseModel):
    user_id: str
    items: List[CartItem]

class CartUpdate(BaseModel):
    items: List[CartItem]

class Cart(BaseModel):
    id: Optional[str] = None
    user_id: str
    items: List[CartItem]

    class Config:
        orm_mode = True