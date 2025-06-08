import uvicorn
import os
import sys

def run_fastapi():
    # Add the project root directory to Python path
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
    sys.path.insert(0, project_root)
    
    # Run FastAPI server
    uvicorn.run(
        "server.src.app.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )

if __name__ == "__main__":
    run_fastapi() 