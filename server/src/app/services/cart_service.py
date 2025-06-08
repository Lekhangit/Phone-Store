from typing import List, Optional
from ..models.cart_model import Cart, CartCreate, CartUpdate, CartItem
from ..models.product_model import Product
from ..repositories.cart_repository import CartRepository
from ..repositories.product_repository import ProductRepository

class CartService:
    def __init__(self, cart_repository: CartRepository, product_repository: ProductRepository):
        self.cart_repository = cart_repository
        self.product_repository = product_repository

    def create_cart(self, cart: CartCreate) -> Cart:
        return self.cart_repository.create(cart)

    def get_cart(self, cart_id: str) -> Optional[Cart]:
        return self.cart_repository.get_by_id(cart_id)

    def get_user_cart(self, user_id: str) -> Optional[Cart]:
        return self.cart_repository.get_by_user_id(user_id)

    def update_cart(self, cart_id: str, cart: CartUpdate) -> Optional[Cart]:
        return self.cart_repository.update(cart_id, cart)

    def add_to_cart(self, cart_id: str, product_id: str, quantity: int) -> Optional[Cart]:
        # Get product to check stock and price
        product = self.product_repository.get_by_id(product_id)
        if not product:
            raise ValueError("Product not found")
        if product.stock < quantity:
            raise ValueError("Not enough stock")

        # Create cart item
        cart_item = CartItem(
            product_id=product_id,
            quantity=quantity,
            price=product.price
        )

        return self.cart_repository.add_item(cart_id, cart_item)

    def remove_from_cart(self, cart_id: str, product_id: str) -> Optional[Cart]:
        return self.cart_repository.remove_item(cart_id, product_id)

    def clear_cart(self, cart_id: str) -> Optional[Cart]:
        update = CartUpdate(items=[])
        return self.cart_repository.update(cart_id, update)

    def delete_cart(self, cart_id: str) -> bool:
        return self.cart_repository.delete(cart_id) 