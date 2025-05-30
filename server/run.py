import subprocess
import sys
import os

def run_fastapi():
    # Add the server directory to Python path
    server_dir = os.path.dirname(os.path.abspath(__file__))
    sys.path.append(server_dir)
    
    try:
        # Run FastAPI server
        subprocess.run([
            "uvicorn",
            "main:app",
            "--host", "127.0.0.1",
            "--port", "8000",
            "--reload"
        ], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error starting FastAPI server: {e}")
    except KeyboardInterrupt:
        print("\nServer stopped")

if __name__ == "__main__":
    run_fastapi()