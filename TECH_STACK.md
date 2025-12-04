# Technology Stack & Purpose

This document outlines the technologies used in the **Virtual Fashion Assistant** project and the specific purpose each serves.

## 🎨 Frontend (User Interface)

| Technology | Purpose |
| :--- | :--- |
| **React** | Core JavaScript library for building the user interface and managing component state. |
| **Vite** | Next-generation build tool and development server. Provides fast hot module replacement (HMR) and optimized builds. |
| **Tailwind CSS** | Utility-first CSS framework used for styling the application. Allows for rapid UI development with a consistent design system. |
| **React Router DOM** | Handles client-side routing, allowing navigation between different pages (Home, Wardrobe, Virtual Try-On, etc.) without reloading the browser. |
| **Framer Motion** | Library for creating smooth animations and transitions (e.g., page transitions, hover effects) to enhance user experience. |
| **Lucide React** | Provides a consistent and clean set of SVG icons used throughout the application. |
| **clsx & tailwind-merge** | Utilities for conditionally constructing CSS class strings and resolving conflicts between Tailwind classes. |
| **face-api.js** | JavaScript API for face detection and recognition in the browser (available for client-side analysis features). |

## ⚙️ Backend (API & Logic)

| Technology | Purpose |
| :--- | :--- |
| **Python** | Primary programming language for the backend server. |
| **Flask** | Lightweight WSGI web application framework used to create the API endpoints (e.g., `/predict-skin-tone`, `/virtual-try-on`). |
| **Flask-CORS** | Extension for handling Cross-Origin Resource Sharing (CORS), allowing the React frontend (port 5173) to communicate with the Flask backend (port 5000). |
| **Pillow (PIL)** | Python Imaging Library used for opening, manipulating, and saving image files on the server. |
| **Gradio Client** | Python client library used to interact with the **Kolors Virtual Try-On** model hosted on Hugging Face Spaces (`Kwai-Kolors/Kolors-Virtual-Try-On`). |

## 🤖 AI & Machine Learning

| Technology | Purpose |
| :--- | :--- |
| **TensorFlow / Keras** | Used to load and run the custom **Skin Tone Analysis Model** (`.h5` file). It processes user photos to classify skin tone (Fair, Brown, Dark). |
| **NumPy** | Fundamental package for scientific computing. Used for handling image arrays and numerical data during preprocessing for the ML models. |
| **Hugging Face Spaces** | Cloud platform hosting the external Virtual Try-On model that our backend communicates with. |

## 🌐 External APIs

| Technology | Purpose |
| :--- | :--- |
| **Open-Meteo API** | Free, open-source weather API used to fetch real-time weather data (temperature, condition, wind speed) for the "Weather & Style" feature. No API key required. |

### 📦 Additional Libraries (Included in Environment)
*These libraries are listed in `requirements.txt` for potential future use or extended features:*
- **OpenCV (`opencv-python`)**: For advanced image processing and computer vision tasks.
- **Pandas**: For data manipulation and analysis.
- **Torch / Torchvision**: Deep learning framework, potentially for other models.
- **Face Recognition**: Library for recognizing and manipulating faces.
- **Scikit-learn**: Machine learning library for data analysis and mining.

## 🛠️ Tools & Infrastructure

| Technology | Purpose |
| :--- | :--- |
| **npm** | Node Package Manager, used to install and manage frontend dependencies. |
| **pip** | Python Package Installer, used to manage backend libraries. |
| **Git** | Version control system for tracking changes in the codebase. |
| **ESLint** | Pluggable linting utility for JavaScript and JSX to ensure code quality. |
| **PostCSS** | Tool for transforming CSS with JavaScript, used by Tailwind CSS. |
| **Autoprefixer** | PostCSS plugin to parse CSS and add vendor prefixes to CSS rules. |
