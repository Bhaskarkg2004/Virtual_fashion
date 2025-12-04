import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# --- CONFIGURATION ---
MODEL_PATH = 'skin_tone_white_brown_black.h5'
# ---------------------

model = None

def load_model():
    global model
    if os.path.exists(MODEL_PATH):
        try:
            print(f"Loading model from {MODEL_PATH}...")
            model = tf.keras.models.load_model(MODEL_PATH)
            print("Model loaded successfully!")
        except Exception as e:
            print(f"Error loading model: {e}")
            model = None
    else:
        print(f"Model file not found at {MODEL_PATH}. Please place your .h5 file in the 'backend' folder.")

# Load model on startup
load_model()

def preprocess_image(image, target_size=(224, 224)):
    """
    Preprocess the image to match your Colab training.
    Adjust target_size and normalization as needed.
    """
    if image.mode != "RGB":
        image = image.convert("RGB")
    
    image = image.resize(target_size)
    image_array = np.array(image)
    
    # Normalize (standard is 0-1 or -1 to 1, check your Colab notebook)
    image_array = image_array / 255.0  
    
    # Add batch dimension (1, 224, 224, 3)
    image_array = np.expand_dims(image_array, axis=0)
    
    return image_array

@app.route('/predict-skin-tone', methods=['POST'])
def predict_skin_tone():
    if 'image' not in request.files:
        return jsonify({'error': 'No image part'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if model is None:
        # Fallback if model isn't loaded (so the app doesn't crash during demo)
        return jsonify({
            'warning': 'Model not loaded. Using mock response.',
            'skinTone': 'Fair',
            'season': 'Summer',
            'colors': ['#A1C4FD', '#C2E9FB', '#FBC2EB', '#F6D365']
        })

    try:
        image = Image.open(io.BytesIO(file.read()))
        processed_image = preprocess_image(image)
        
        prediction = model.predict(processed_image)
        
        # --- INTERPRET PREDICTION ---
        # Updated based on user input: {'Black': 0, 'Brown': 1, 'White': 2}
        classes = ['Black', 'Brown', 'White'] 
        predicted_class_index = np.argmax(prediction)
        predicted_tone = classes[predicted_class_index]
        
        # Map skin tone to seasonal palettes with detailed recommendations
        palettes = {
            'White': {
                'skinColor': '#F5E0D8', # Representative Fair Skin Hex
                'season': 'Summer/Winter',
                'colors': [
                    {'name': 'White', 'hex': '#FFFFFF'},
                    {'name': 'Navy Blue', 'hex': '#000080'},
                    {'name': 'Soft Pink', 'hex': '#FBC2EB'},
                    {'name': 'Lavender', 'hex': '#E0C3FC'},
                    {'name': 'Slate Grey', 'hex': '#708090'},
                    {'name': 'Charcoal', 'hex': '#36454F'}
                ],
                'avoid': [
                    {'name': 'Neon Yellow', 'hex': '#FFFF00'},
                    {'name': 'Lime Green', 'hex': '#CCFF00'},
                    {'name': 'Bright Orange', 'hex': '#FFA500'}
                ],
                'combinations': [
                    {'name': 'Casual Cool', 'description': 'Light Blue Shirt + Grey Chinos', 'colors': [{'name': 'Light Blue', 'hex': '#A1C4FD'}, {'name': 'Grey', 'hex': '#708090'}]},
                    {'name': 'Evening Sharp', 'description': 'Charcoal Suit + White Shirt', 'colors': [{'name': 'Charcoal', 'hex': '#36454F'}, {'name': 'White', 'hex': '#FFFFFF'}]}
                ]
            },
            'Brown': {
                'skinColor': '#8D5524', # Representative Brown Skin Hex
                'season': 'Autumn',
                'colors': [
                    {'name': 'White', 'hex': '#FFFFFF'},
                    {'name': 'Teal', 'hex': '#008080'},
                    {'name': 'Mustard', 'hex': '#FFD200'},
                    {'name': 'Burnt Orange', 'hex': '#F7971E'},
                    {'name': 'Olive', 'hex': '#556B2F'},
                    {'name': 'Saddle Brown', 'hex': '#8B4513'}
                ],
                'avoid': [
                    {'name': 'Pale Lavender', 'hex': '#E6E6FA'},
                    {'name': 'Baby Pink', 'hex': '#FFB6C1'},
                    {'name': 'Alice Blue', 'hex': '#F0F8FF'}
                ],
                'combinations': [
                    {'name': 'Earth Tone', 'description': 'Olive Green Jacket + Beige Trousers', 'colors': [{'name': 'Olive', 'hex': '#556B2F'}, {'name': 'Beige', 'hex': '#F5F5DC'}]},
                    {'name': 'Warm Casual', 'description': 'Mustard Sweater + Dark Denim', 'colors': [{'name': 'Mustard', 'hex': '#FFD200'}, {'name': 'Navy', 'hex': '#000080'}]}
                ]
            },
            'Black': {
                'skinColor': '#3B2219', # Representative Dark Skin Hex
                'season': 'Winter',
                'colors': [
                    {'name': 'White', 'hex': '#FFFFFF'},
                    {'name': 'Burgundy', 'hex': '#800020'},
                    {'name': 'Emerald Green', 'hex': '#43E97B'},
                    {'name': 'Turquoise', 'hex': '#38F9D7'},
                    {'name': 'Bright Red', 'hex': '#FF0000'},
                    {'name': 'Royal Blue', 'hex': '#4169E1'}
                ],
                'avoid': [
                    {'name': 'Dim Grey', 'hex': '#696969'},
                    {'name': 'Muddy Brown', 'hex': '#8B4513'},
                    {'name': 'Olive Drab', 'hex': '#556B2F'}
                ],
                'combinations': [
                    {'name': 'High Contrast', 'description': 'White Tee + Black Jeans', 'colors': [{'name': 'White', 'hex': '#FFFFFF'}, {'name': 'Black', 'hex': '#000000'}]},
                    {'name': 'Bold Statement', 'description': 'Red Hoodie + Black Joggers', 'colors': [{'name': 'Red', 'hex': '#FF0000'}, {'name': 'Black', 'hex': '#000000'}]}
                ]
            }
        }
        
        result = palettes.get(predicted_tone, {'skinColor': '#e0ac69', 'season': 'Unknown', 'colors': [], 'avoid': [], 'combinations': []})
        
        return jsonify({
            'skinTone': predicted_tone,
            'skinToneHex': result['skinColor'],
            'season': result['season'],
            'colors': result['colors'],
            'avoid': result.get('avoid', []),
            'combinations': result.get('combinations', [])
        })

    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
