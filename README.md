# StyleMate - AI-Powered Wardrobe & Style Assistant

StyleMate is a modern, React-based web application designed to help users manage their wardrobe, analyze their style, and virtually try on clothes. It features a premium glassmorphism design and simulates AI-powered features like skin tone analysis and virtual try-on.

## 🚀 Features

### 1. 🔐 Authentication
- **Secure Login/Signup**: Toggle between login and signup modes.
- **Mock Authentication**: Simulates user sessions and profile management.

### 2. 👗 Wardrobe Management
- **Digital Closet**: View all your clothes in a grid layout.
- **Categorization**: Filter by Top, Bottom, Sports, Formals, Home Wear, etc.z
- **Add Items**: Upload photos of your clothes and categorize them.
- **Delete Items**: Remove unwanted items from your collection.

### 3. 📊 Dashboard
- **Overview**: View total items and style score.
- **Quick Actions**: Shortcuts to add clothes or access the style guide.
- **Outfit of the Day**: Get a random outfit suggestion (Top + Bottom).
- **Recent Additions**: Quick view of your latest wardrobe items.

### 4. 🎨 Style Assistant (Mock ML)
- **Skin Tone Analysis**: Upload a photo to simulate skin tone detection.
- **Color Recommendations**: Get a curated color palette based on the analysis.

### 5. 👕 Virtual Try-On (Mock ML)
- **Dual Upload**: Upload a photo of yourself and a clothing item.
- **Simulation**: Visualizes the "processing" of the try-on request.

### 6. 👤 Profile Management
- **Personal Details**: Manage name, bio, and contact info.
- **Body Measurements**: Store height, weight, and sizes.
- **Style Preferences**: Set your style archetype and favorite colors.
- **Profile Photo**: Upload and update your profile picture.

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite)
- **Styling**: Tailwind CSS, PostCSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React Context API

## 📦 Installation & Setup

Follow these steps to run the project on your local machine:

### Prerequisites
- **Node.js**: Ensure you have Node.js installed (v14 or higher recommended).

### Frontend (Current)
1.  **Install Node.js Dependencies** (Equivalent to `pip install` for JavaScript):
    ```bash
    npm install
    ```

2.  **Run the App**:
    ```bash
    npm run dev
    ```

### Backend (Proposed ML Engine)
If you proceed to implement the Python backend for Deep Learning features:

1.  **Install Python Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

2.  **Run the Python Server** (e.g., app.py):
    ```bash
    # Run from the project root directory
    python backend/app.py
    ```

## 🔮 Future Scope (Deep Learning Integration)

Currently, the AI features (Style Assistant, Virtual Try-On) use mock logic for demonstration. To upgrade this to a full **Deep Learning Project**, the following integrations are planned:

-   **Face Detection**: Integrate `face-api.js` or a Python backend (OpenCV/MTCNN) for real-time face detection.
-   **Skin Tone Analysis**: Implement computer vision algorithms (K-Means Clustering) to extract actual skin tone from uploaded photos.
-   **Virtual Try-On**: Connect to a Python backend running a GAN (Generative Adversarial Network) model like CP-VTON+ or DensePose.

## 📄 License

This project is for educational purposes.
