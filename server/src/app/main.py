import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .routes import product, user, cart, order
from .db.database import Database

app = FastAPI(title="E-commerce API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Mount static files
# Calculate the absolute path to the 'uploads' directory which is at server/uploads
current_file_dir = os.path.dirname(os.path.abspath(__file__))
server_root_dir = os.path.abspath(os.path.join(current_file_dir, '..', '..'))
uploads_dir_path = os.path.join(server_root_dir, 'uploads')

os.makedirs(uploads_dir_path, exist_ok=True) # Ensure the uploads directory exists
app.mount("/uploads", StaticFiles(directory=uploads_dir_path), name="uploads")

# Include routers
app.include_router(product.router, prefix="/api/products", tags=["products"])
app.include_router(user.router, prefix="/api/users", tags=["users"])
app.include_router(cart.router, prefix="/api/carts", tags=["carts"])
app.include_router(order.router, prefix="/api/orders", tags=["orders"])

# Connect to database immediately when the app starts (since pymongo is synchronous)
Database.connect_db()
print(f"Database connected: {Database.get_db().name}")

@app.get("/")
async def root():
    return {"message": "Welcome to E-commerce API"} 