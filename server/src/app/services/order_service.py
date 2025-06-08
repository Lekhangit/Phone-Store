from typing import List, Optional
from ..models.order_model import Order, OrderCreate
from ..models.cart_model import Cart
from ..repositories.order_repository import OrderRepository
from ..repositories.cart_repository import CartRepository
from ..repositories.product_repository import ProductRepository

class OrderService:
    def __init__(
        self,
        order_repository: OrderRepository,
        cart_repository: CartRepository,
        product_repository: ProductRepository
    ):
        self.order_repository = order_repository
        self.cart_repository = cart_repository
        self.product_repository = product_repository

    def create_order(self, order: OrderCreate) -> Order:
        return self.order_repository.create(order)

    def get_order(self, order_id: str) -> Optional[Order]:
        return self.order_repository.get_by_id(order_id)

    def get_user_orders(self, user_id: str, skip: int = 0, limit: int = 100) -> List[Order]:
        return self.order_repository.get_by_user_id(user_id, skip, limit)

    def get_all_orders(self, skip: int = 0, limit: int = 100) -> List[Order]:
        return self.order_repository.get_all(skip, limit)


    def create_order_from_cart(self, user_id: str, cart_id: str, shipping_address: str) -> Order:
        # Get cart
        cart = self.cart_repository.get_by_id(cart_id)
        if not cart or cart.user_id != user_id:
            raise ValueError("Cart not found or does not belong to user")

        # Create order items from cart items
        order_items = []
        for item in cart.items:
            # Verify product exists and has enough stock
            product = self.product_repository.get_by_id(item.product_id)
            if not product:
                raise ValueError(f"Product {item.product_id} not found")
            if product.stock < item.quantity:
                raise ValueError(f"Not enough stock for product {product.name}")

            # Update product stock
            self.product_repository.update_stock(item.product_id, -item.quantity)

            order_items.append(item)

        # Create order
        order = OrderCreate(
            user_id=user_id,
            items=order_items,
            shipping_address=shipping_address,
            total_amount=cart.total
        )

        # Create order and clear cart
        created_order = self.order_repository.create(order)
        self.cart_repository.clear_cart(cart_id)

        return created_order

    def delete_order(self, order_id: str) -> bool:
        return self.order_repository.delete(order_id) 