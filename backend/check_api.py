from gradio_client import Client

try:
    client = Client("Kwai-Kolors/Kolors-Virtual-Try-On")
    print("API Information:")
    client.view_api()
except Exception as e:
    print(f"Error: {e}")
