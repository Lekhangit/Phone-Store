from typing import List, Optional
from ..models.user_model import User, UserCreate, UserUpdate
from ..repositories.user_repository import UserRepository
from ..core.security import verify_password

class UserService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def create_user(self, user: UserCreate) -> User:
        # Check if user with email already exists
        existing_user = self.user_repository.get_by_email(user.email)
        if existing_user:
            raise ValueError("User with this email already exists")
        return self.user_repository.create(user)

    def get_user(self, user_id: str) -> Optional[User]:
        return self.user_repository.get_by_id(user_id)

    def get_user_by_email(self, email: str) -> Optional[User]:
        return self.user_repository.get_by_email(email)

    def get_users(self, skip: int = 0, limit: int = 100) -> List[User]:
        return self.user_repository.get_all(skip, limit)

    def update_user(self, user_id: str, user: UserUpdate) -> Optional[User]:
        if user.email:
            # Check if email is already taken by another user
            existing_user = self.user_repository.get_by_email(user.email)
            if existing_user and existing_user.id != user_id:
                raise ValueError("Email already taken")
        return self.user_repository.update(user_id, user)

    def delete_user(self, user_id: str) -> bool:
        return self.user_repository.delete(user_id)

    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        user = self.user_repository.get_by_email(email)
        if not user:
            return None
        if not verify_password(password, user.password):
            return None
        return user 