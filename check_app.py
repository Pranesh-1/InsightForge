
try:
    print("Attempting to import app from backend.main...")
    from backend.main import app
    print("App imported successfully.")
except Exception as e:
    print("Failed to import app:")
    import traceback
    traceback.print_exc()
