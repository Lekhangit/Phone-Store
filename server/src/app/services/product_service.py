from typing import List, Optional
from ..models.product_model import Product, ProductCreate, ProductUpdate
from ..repositories.product_repository import ProductRepository

class ProductService:
    def __init__(self, product_repository: ProductRepository):
        self.product_repository = product_repository

    def create_product(self, product: ProductCreate) -> Product:
        # Check if product with same name exists
        existing_product = self.product_repository.get_by_name(product.name)
        if existing_product:
            raise ValueError("Product with this name already exists")
        return self.product_repository.create(product)

    def get_product(self, product_id: str) -> Optional[Product]:
        return self.product_repository.get_by_id(product_id)

    def get_product_by_name(self, name: str) -> Optional[Product]:
        return self.product_repository.get_by_name(name)

    def get_products(self, skip: int = 0, limit: int = 100) -> List[Product]:
        return self.product_repository.get_all(skip, limit)

    def update_product(self, product_id: str, product: ProductUpdate) -> Optional[Product]:
        # Check if product exists
        existing_product = self.get_product(product_id)
        if not existing_product:
            return None

        # If name is being updated, check for duplicates
        if product.name and product.name != existing_product.name:
            duplicate = self.product_repository.get_by_name(product.name)
            if duplicate:
                raise ValueError("Product with this name already exists")

        return self.product_repository.update(product_id, product)

    def delete_product(self, product_id: str) -> bool:
        return self.product_repository.delete(product_id)

    def update_stock(self, product_id: str, quantity: int) -> Optional[Product]:
        product = self.get_product(product_id)
        if not product:
            return None

        new_stock = product.stock + quantity
        if new_stock < 0:
            return None

        update = ProductUpdate(stock=new_stock)
        return self.product_repository.update(product_id, update) 