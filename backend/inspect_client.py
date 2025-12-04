from gradio_client import Client
import json

try:
    client = Client("Kwai-Kolors/Kolors-Virtual-Try-On")
    print("Client endpoints:")
    # Accessing private attribute to debug, as view_api() failed
    if hasattr(client, 'endpoints'):
        for i, endpoint in enumerate(client.endpoints):
            print(f"Endpoint {i}: {endpoint}")
    else:
        print("No endpoints attribute found.")
        
    print("\nConfig:")
    if hasattr(client, 'config'):
        print(json.dumps(client.config, indent=2))
        
except Exception as e:
    print(f"Error: {e}")
