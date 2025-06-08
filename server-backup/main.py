# from fastapi import FastAPI
# from fastapi.staticfiles import StaticFiles
# from fastapi.middleware.cors import CORSMiddleware
# from routes import product, user, order, cart, gemini_routes
# import uvicorn

# app = FastAPI()

# # Include routers
# app.include_router(product.router, tags=["products"])
# app.include_router(user.router, prefix="/api/users", tags=["users"])
# app.include_router(order.router, prefix="/api/orders", tags=["orders"])
# app.include_router(cart.router, prefix="/api/carts", tags=["carts"])
# app.include_router(gemini_routes.router, prefix="/api/gemini", tags=["gemini"])

# # Mount static files
# app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# # CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# if __name__ == "__main__":
#     uvicorn.run(
#         "src.app.main:app",
#         host="127.0.0.1",
#         port=8000,
#         reload=True
#     )