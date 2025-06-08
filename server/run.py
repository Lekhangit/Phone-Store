# import subprocess
# import sys
# import os

# def run_fastapi():
#     # Add the project root directory to Python path for the current process
#     project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
#     sys.path.insert(0, project_root)
    
#     # Prepare the environment for the subprocess
#     env = os.environ.copy()
#     # Ensure the project root is in PYTHONPATH for the subprocess
#     if 'PYTHONPATH' in env:
#         env['PYTHONPATH'] = f"{project_root};{env['PYTHONPATH']}"
#     else:
#         env['PYTHONPATH'] = project_root

#     try:
#         # Run FastAPI server
#         subprocess.run([
#             "uvicorn",
#             "server.src.app.main:app",
#             "--host", "127.0.0.1",
#             "--port", "8000",
#             "--reload"
#         ], check=True, env=env)
#     except subprocess.CalledProcessError as e:
#         print(f"Error starting FastAPI server: {e}")
#     except KeyboardInterrupt:
#         print("\nServer stopped")

# if __name__ == "__main__":
#     run_fastapi()