from pydantic import BaseModel
from typing import Optional
from bson import ObjectId

class ProductBase(BaseModel):
    name: Optional[str] = None
    brand: Optional[str] = None
    price: Optional[float] = None
    image: Optional[str] = None
    rating: Optional[float] = None
    stock: Optional[int] = None
    sale_price: Optional[float] = None
    description: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(ProductBase):
    pass

class Product(ProductBase):
    id: str

    class Config:
        orm_mode = True
