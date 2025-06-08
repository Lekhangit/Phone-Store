from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from .db.database import get_product_collection, get_user_collection, get_cart_collection, get_order_collection
from .repositories.product_repository import ProductRepository
from .repositories.user_repository import UserRepository
from .repositories.cart_repository import CartRepository
from .repositories.order_repository import OrderRepository
from .services.product_service import ProductService
from .services.user_service import UserService
from .services.cart_service import CartService
from .services.order_service import OrderService
from .core.security import verify_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/users/login")

# Repositories
def get_product_repository():
    return ProductRepository(get_product_collection())

def get_user_repository():
    return UserRepository(get_user_collection())

def get_cart_repository():
    return CartRepository(get_cart_collection())

def get_order_repository():
    return OrderRepository(get_order_collection())

# Services
def get_product_service():
    product_repository = get_product_repository()
    return ProductService(product_repository)

def get_user_service():
    user_repository = get_user_repository()
    return UserService(user_repository)

def get_cart_service():
    cart_repository = get_cart_repository()
    product_repository = get_product_repository()
    return CartService(cart_repository, product_repository)

def get_order_service():
    order_repository = get_order_repository()
    cart_repository = get_cart_repository()
    product_repository = get_product_repository()
    return OrderService(order_repository, cart_repository, product_repository)

# Authentication
def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = verify_token(token)
    if payload is None:
        raise credentials_exception
    
    user_id = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    
    user_service = get_user_service()
    user = user_service.get_user(user_id)
    if user is None:
        raise credentials_exception
    
    return user 