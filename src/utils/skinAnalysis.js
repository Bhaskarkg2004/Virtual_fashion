import * as faceapi from 'face-api.js';

// Load models from a public CDN to avoid large local files
const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';

export const loadModels = async () => {
    try {
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        ]);
        return true;
    } catch (error) {
        console.error('Error loading models:', error);
        throw new Error('Failed to load ML models');
    }
};

export const analyzeImage = async (imageElement) => {
    try {
        // 1. Detect Face & Landmarks
        const detection = await faceapi.detectSingleFace(
            imageElement,
            new faceapi.TinyFaceDetectorOptions()
        ).withFaceLandmarks();

        if (!detection) {
            throw new Error('No face detected. Please upload a clear selfie.');
        }

        const landmarks = detection.landmarks;

        // 2. Extract Skin Color from Cheek Area
        // Left Cheek: approximate area between nose (30) and left jaw (3)
        const nose = landmarks.positions[30];
        const leftJaw = landmarks.positions[3];
        const leftEye = landmarks.positions[36];

        // Calculate a sample point on the left cheek
        const sampleX = (nose.x + leftJaw.x) / 2;
        const sampleY = (nose.y + leftEye.y * 2) / 3; // Slightly below eye level

        const color = getAverageColor(imageElement, sampleX, sampleY, 20); // 20px radius
        const undertone = determineUndertone(color);

        // Generate Outfit Combinations
        const combinations = generateOutfitCombinations(undertone.recommendations);

        return {
            skinTone: undertone.type,
            skinToneHex: rgbToHex(color.r, color.g, color.b),
            description: undertone.description,
            recommendations: undertone.recommendations,
            combinations: combinations,
            avoid: undertone.avoid
        };

    } catch (error) {
        console.error('Analysis failed:', error);
        throw error;
    }
};

// Helper: Generate Outfit Combinations
const generateOutfitCombinations = (palette) => {
    const combinations = [];

    // We need at least a few colors to make combinations
    if (palette.length < 4) return combinations;

    // 1. High Contrast (Complementary)
    // Usually the first item is complementary
    combinations.push({
        name: 'Bold Contrast',
        description: 'High impact look for events',
        colors: [palette[0], palette[palette.length - 1]] // Complementary + Neutral/Dark
    });

    // 2. Balanced (Triadic)
    combinations.push({
        name: 'Balanced Harmony',
        description: 'Colorful yet balanced',
        colors: [palette[3], palette[4]] // Triadic pair
    });

    // 3. Subtle (Analogous)
    combinations.push({
        name: 'Subtle & Chic',
        description: 'Sophisticated, low-contrast look',
        colors: [palette[5], palette[6]] // Analogous pair
    });

    // 4. Monochromatic (Tonal)
    combinations.push({
        name: 'Monochromatic',
        description: 'Modern, slimming, and elegant',
        colors: [palette[7], palette[8]] // Light + Dark tone
    });

    return combinations;
};

// Helper: Get average color from a region
const getAverageColor = (img, x, y, radius) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);

    // Ensure bounds
    const startX = Math.max(0, Math.floor(x - radius));
    const startY = Math.max(0, Math.floor(y - radius));
    const size = radius * 2;

    const imageData = ctx.getImageData(startX, startY, size, size);
    const data = imageData.data;

    let r = 0, g = 0, b = 0, count = 0;

    for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
    }

    return {
        r: Math.round(r / count),
        g: Math.round(g / count),
        b: Math.round(b / count)
    };
};

// Helper: Determine undertone based on RGB/Lab
const determineUndertone = ({ r, g, b }) => {
    const { h, s, l } = rgbToHsl(r, g, b);

    // Skin hue is usually between 10 (Red-Orange) and 45 (Orange-Yellow).
    // We'll use Hue for Undertone and Lightness for Contrast/Depth.

    let type = 'Neutral Undertone';
    let description = 'You have a balanced mix of warm and cool undertones.';
    let avoid = ['Neon Colors', 'Overly Bright Yellow'];

    // Determine Season first to tune the palette
    let season = 'Neutral';
    if (h < 19) {
        season = l > 45 ? 'Summer' : 'Winter';
    } else if (h > 23) {
        season = l > 45 ? 'Spring' : 'Autumn';
    }

    // Generate Dynamic Palette based on Color Theory
    // We generate colors relative to the skin hue (h)
    const palette = generateDynamicPalette(h, s, l, season);
    const recommendations = palette;

    if (season === 'Summer') {
        type = 'Summer (Cool & Soft)';
        description = 'You have cool undertones with a delicate, soft quality. Pastels and soft cool colors look amazing on you.';
        avoid = ['Orange', 'Black', 'Bright Yellow'];
    } else if (season === 'Winter') {
        type = 'Winter (Cool & Deep)';
        description = 'You have cool undertones with high contrast or deep coloring. Vivid, icy, and high-contrast colors suit you best.';
        avoid = ['Beige', 'Orange', 'Gold'];
    } else if (season === 'Spring') {
        type = 'Spring (Warm & Bright)';
        description = 'You have warm undertones with a fresh, bright quality. Clear, warm, and energetic colors make you glow.';
        avoid = ['Black', 'Icy Blue', 'Dark Grey'];
    } else if (season === 'Autumn') {
        type = 'Autumn (Warm & Deep)';
        description = 'You have warm undertones with a rich, earthy quality. Deep, warm, and muted colors are your best look.';
        avoid = ['Neon Pink', 'Pastels', 'Blue-Grey'];
    }

    return { type, description, recommendations, avoid };
};

// Helper: Generate Dynamic Palette
const generateDynamicPalette = (h, s, l, season) => {
    const palette = [];

    // Tuning parameters based on season
    let targetS = 50; // Default saturation
    let targetL = 50; // Default lightness

    if (season === 'Summer') { targetS = 30; targetL = 70; } // Soft, Light
    if (season === 'Winter') { targetS = 80; targetL = 40; } // Vivid, Deep
    if (season === 'Spring') { targetS = 70; targetL = 60; } // Bright, Light
    if (season === 'Autumn') { targetS = 60; targetL = 35; } // Rich, Deep

    // 1. Complementary (Opposite) - High Contrast
    palette.push({ name: 'Complementary', hex: hslToHex((h + 180) % 360, targetS, targetL) });

    // 2. Split Complementary
    palette.push({ name: 'Split Complementary', hex: hslToHex((h + 150) % 360, targetS, targetL) });

    // 3. Triadic (Balanced)
    palette.push({ name: 'Triadic Harmony', hex: hslToHex((h + 120) % 360, targetS, targetL) });

    // 4. Analogous (Harmonious)
    palette.push({ name: 'Analogous Glow', hex: hslToHex((h + 30) % 360, targetS, targetL) });

    // --- MONOCHROMATIC (Tonal) ---

    // 5. Lighter Tone (Highlight)
    palette.push({ name: 'Tonal Light', hex: hslToHex(h, targetS, Math.min(targetL + 20, 95)) });

    // 6. Darker Tone (Shadow)
    palette.push({ name: 'Tonal Deep', hex: hslToHex(h, targetS, Math.max(targetL - 20, 10)) });

    // --- SEASONAL NEUTRALS ---

    if (season === 'Winter') {
        palette.push({ name: 'Pure Black', hex: '#000000' });
        palette.push({ name: 'Icy White', hex: '#F8F9FA' });
        palette.push({ name: 'True Grey', hex: '#808080' });
    } else if (season === 'Summer') {
        palette.push({ name: 'Soft White', hex: '#F5F5F5' });
        palette.push({ name: 'Rose Beige', hex: '#E8DCCA' });
        palette.push({ name: 'Slate', hex: '#708090' });
    } else if (season === 'Spring') {
        palette.push({ name: 'Cream', hex: '#FFFDD0' });
        palette.push({ name: 'Camel', hex: '#C19A6B' });
        palette.push({ name: 'Warm Grey', hex: '#A9A9A9' });
    } else { // Autumn
        palette.push({ name: 'Oyster White', hex: '#EAE0C8' });
        palette.push({ name: 'Dark Chocolate', hex: '#492000' });
        palette.push({ name: 'Khaki', hex: '#F0E68C' });
    }

    return palette;
};

// Helper: RGB to Hex
const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

// Helper: HSL to Hex
const hslToHex = (h, s, l) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
};

// Helper: RGB to HSL
const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
};
