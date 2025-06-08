from fastapi import APIRouter, HTTPException, UploadFile, File
from crud import product as crud
from models.product import Product, ProductCreate, ProductUpdate
import os
import shutil

router = APIRouter(prefix="/products", tags=["Products"])

UPLOAD_DIR = "uploads"

@router.post("/upload-image/")
async def upload_image(file: UploadFile = File(...)):
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"filename": file.filename}

@router.get("/", response_model=list[Product])
def read_products(skip: int = 0, limit: int = 100):
    return crud.get_products(skip, limit)

@router.get("/{product_id}", response_model=Product)
def read_product(product_id: str):
    product = crud.get_product(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("/", response_model=Product)
def create_product(product: ProductCreate):
    return crud.create_product(product)

@router.put("/{product_id}", response_model=Product)
def update_product(product_id: str, product: ProductUpdate):
    updated = crud.update_product(product_id, product)
    if not updated:
        raise HTTPException(status_code=404, detail="Product not found")
    return updated

@router.delete("/{product_id}", response_model=Product)
def delete_product(product_id: str):
    deleted = crud.delete_product(product_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Product not found")
    return deleted
