from fastapi import FastAPI
from routes import product, user, order,cart,geminiChatbot
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.include_router(product.router)
app.include_router(user.router)
app.include_router(order.router)
app.include_router(cart.router)
app.include_router(geminiChatbot.router)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # hoặc ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)