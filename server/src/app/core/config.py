import os
from dotenv import load_dotenv
from typing import Optional

# Load environment variables from .env file
load_dotenv()

# MongoDB Atlas Configuration
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb+srv://khangle123:khangle123@cluster0.attleyo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
MONGO_DB_NAME = os.getenv("DB_NAME", "phone")

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "khangle123")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 1440))  # 24 hours

# App Settings
APP_NAME = os.getenv("APP_NAME", "Phone Store API")
DEBUG = os.getenv("DEBUG", "False").lower() == "true"
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "").split(",")

# File Upload Configuration
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")
MAX_UPLOAD_SIZE = 5 * 1024 * 1024  # 5MB
