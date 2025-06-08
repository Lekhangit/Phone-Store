from pydantic import BaseModel
from typing import List, Optional

class OrderItem(BaseModel):
    product_id: str
    quantity: int
    name: str
    brand: str
    price: float
    image: str
    rating: Optional[float] = None
    stock: Optional[int] = None
    sale_price: Optional[float] = None
    description: Optional[str] = None


class OrderCreate(BaseModel):
    user_id: str
    items: List[OrderItem]

class Order(OrderCreate):
    id: str
    user_id: str
    items: List[OrderItem]

    class Config:
        orm_mode = True