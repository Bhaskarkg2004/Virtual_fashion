from gradio_client import Client
import json

try:
    client = Client("Kwai-Kolors/Kolors-Virtual-Try-On")
    if hasattr(client, 'config') and 'dependencies' in client.config:
        for dep in client.config['dependencies']:
            print(f"ID: {dep['id']}, API Name: {dep.get('api_name')}, Inputs: {len(dep['inputs'])}, Outputs: {len(dep['outputs'])}")
            
except Exception as e:
    print(f"Error: {e}")
