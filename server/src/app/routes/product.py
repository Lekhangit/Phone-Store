from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
import os
import shutil
from ..models.product_model import Product, ProductCreate, ProductUpdate
from ..services.product_service import ProductService
from ..dependencies import get_product_service

router = APIRouter(prefix="/api/products", tags=["products"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload-image/")
def upload_image(file: UploadFile = File(...)):
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return {"filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error uploading image: {str(e)}")

@router.post("/", response_model=Product)
def create_product(
    product: ProductCreate,
    product_service: ProductService = Depends(get_product_service)
):
    try:
        return product_service.create_product(product)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error creating product: {str(e)}")

@router.get("/{product_id}", response_model=Product)
def get_product(
    product_id: str,
    product_service: ProductService = Depends(get_product_service)
):
    try:
        product = product_service.get_product(product_id)
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
        return product
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error getting product: {str(e)}")

@router.get("/name/{name}", response_model=Product)
def get_product_by_name(
    name: str,
    product_service: ProductService = Depends(get_product_service)
):
    try:
        product = product_service.get_product_by_name(name)
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
        return product
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error getting product by name: {str(e)}")

@router.get("/", response_model=List[Product])
def get_products(
    skip: int = 0,
    limit: int = 100,
    product_service: ProductService = Depends(get_product_service)
):
    try:
        return product_service.get_products(skip, limit)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error getting products: {str(e)}")

@router.put("/{product_id}", response_model=Product)
def update_product(
    product_id: str,
    product: ProductUpdate,
    product_service: ProductService = Depends(get_product_service)
):
    try:
        updated_product = product_service.update_product(product_id, product)
        if not updated_product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
        return updated_product
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error updating product: {str(e)}")

@router.delete("/{product_id}")
def delete_product(
    product_id: str,
    product_service: ProductService = Depends(get_product_service)
):
    try:
        if not product_service.delete_product(product_id):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
        return {"message": "Product deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error deleting product: {str(e)}") 