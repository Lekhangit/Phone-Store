from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from ..models.user_model import User, UserCreate, UserUpdate
from ..services.user_service import UserService
from ..dependencies import get_user_service

router = APIRouter(prefix="/api/users", tags=["users"])

@router.post("/", response_model=User)
def create_user(
    user: UserCreate,
    user_service: UserService = Depends(get_user_service)
):
    try:
        return user_service.create_user(user)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error creating user: {str(e)}")

@router.get("/{user_id}", response_model=User)
def get_user(
    user_id: str,
    user_service: UserService = Depends(get_user_service)
):
    try:
        user = user_service.get_user(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error getting user: {str(e)}")

@router.get("/", response_model=List[User])
def get_users(
    skip: int = 0,
    limit: int = 100,
    user_service: UserService = Depends(get_user_service)
):
    try:
        return user_service.get_users(skip, limit)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error getting users: {str(e)}")

@router.put("/{user_id}", response_model=User)
def update_user(
    user_id: str,
    user: UserUpdate,
    user_service: UserService = Depends(get_user_service)
):
    try:
        updated_user = user_service.update_user(user_id, user)
        if not updated_user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return updated_user
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error updating user: {str(e)}")

@router.delete("/{user_id}")
def delete_user(
    user_id: str,
    user_service: UserService = Depends(get_user_service)
):
    try:
        if not user_service.delete_user(user_id):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return {"message": "User deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error deleting user: {str(e)}") 