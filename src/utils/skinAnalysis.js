import axios from 'axios';

// API Endpoint
const API_URL = 'http://localhost:5000/predict-skin-tone';

export const loadModels = async () => {
    // No local models needed anymore, but keeping the function signature to avoid breaking callers
    return true;
};

export const analyzeImage = async (imageElement) => {
    try {
        // 1. Convert Image to Blob
        const blob = await imageToBlob(imageElement);

        // 2. Prepare FormData
        const formData = new FormData();
        formData.append('image', blob, 'capture.jpg');

        // 3. Send to Backend
        const response = await axios.post(API_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        const data = response.data;

        if (data.error) {
            throw new Error(data.error);
        }

        // 4. Return formatted result
        // Backend returns: { skinTone, skinToneHex, season, colors, avoid, combinations }
        // Frontend expects: { skinTone, skinToneHex, description, recommendations, combinations, avoid }

        // Map backend response to frontend expectation
        return {
            skinTone: data.skinTone,
            skinToneHex: data.skinToneHex,
            description: `Detected Season: ${data.season}`, // Using season as description for now
            recommendations: data.colors,
            combinations: data.combinations,
            avoid: data.avoid
        };

    } catch (error) {
        console.error('Analysis failed:', error);
        throw new Error('Failed to analyze skin tone. Please ensure the backend is running.');
    }
};

// Helper: Convert Image Element to Blob
const imageToBlob = (img) => {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
            resolve(blob);
        }, 'image/jpeg', 0.95);
    });
};
