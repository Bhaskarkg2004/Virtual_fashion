from gradio_client import Client
import json

try:
    client = Client("Kwai-Kolors/Kolors-Virtual-Try-On")
    if hasattr(client, 'config') and 'dependencies' in client.config:
        for dep in client.config['dependencies']:
            if dep['id'] == 2: # The one we found
                print(f"Endpoint ID: {dep['id']}")
                print("Inputs:")
                for input_id in dep['inputs']:
                    # Find component with this id
                    comp = next((c for c in client.config['components'] if c['id'] == input_id), None)
                    if comp:
                        print(f"  - ID: {input_id}, Type: {comp['type']}, Label: {comp.get('props', {}).get('label')}")
            
except Exception as e:
    print(f"Error: {e}")
