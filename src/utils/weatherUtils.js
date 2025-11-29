// Open-Meteo API Integration
// Free, no API key required

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

// Map WMO Weather Codes to our conditions
const getWeatherCondition = (code) => {
    if (code === 0) return { condition: 'Sunny', icon: '☀️' };
    if (code >= 1 && code <= 3) return { condition: 'Partly Cloudy', icon: '⛅' };
    if (code >= 45 && code <= 48) return { condition: 'Foggy', icon: '🌫️' };
    if (code >= 51 && code <= 67) return { condition: 'Rainy', icon: '🌧️' };
    if (code >= 71 && code <= 77) return { condition: 'Snowy', icon: '❄️' };
    if (code >= 80 && code <= 82) return { condition: 'Heavy Rain', icon: '⛈️' };
    if (code >= 95 && code <= 99) return { condition: 'Thunderstorm', icon: '⚡' };
    return { condition: 'Cloudy', icon: '☁️' };
};

export const getWeather = async (location = 'New York') => {
    try {
        // 1. Geocoding: Get coordinates for the city
        const geoRes = await fetch(`${GEOCODING_API}?name=${encodeURIComponent(location)}&count=1&language=en&format=json`);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error('Location not found');
        }

        const { latitude, longitude, name, country } = geoData.results[0];
        const locationName = `${name}, ${country}`;

        // 2. Weather: Get current weather for coordinates
        const weatherRes = await fetch(
            `${WEATHER_API}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`
        );
        const weatherData = await weatherRes.json();
        const current = weatherData.current;

        const { condition, icon } = getWeatherCondition(current.weather_code);

        return {
            temp: Math.round(current.temperature_2m),
            condition,
            location: locationName,
            humidity: current.relative_humidity_2m,
            windSpeed: Math.round(current.wind_speed_10m),
            icon // Return icon directly from here if needed, though getSeasonalRecommendation also provides one
        };
    } catch (error) {
        console.error("Error fetching weather:", error);
        throw error;
    }
};

// Smart Recommendation Engine (Expert System)

// 1. Clothing Knowledge Base
const CLOTHING_DB = {
    tops: [
        { name: 'Linen Shirt', warmth: 1, breathable: true, waterResistant: false, windResistant: false, type: 'Top' },
        { name: 'Cotton T-Shirt', warmth: 2, breathable: true, waterResistant: false, windResistant: false, type: 'Top' },
        { name: 'Long-Sleeve Henley', warmth: 3, breathable: true, waterResistant: false, windResistant: false, type: 'Top' },
        { name: 'Flannel Shirt', warmth: 4, breathable: true, waterResistant: false, windResistant: false, type: 'Top' },
        { name: 'Merino Wool Sweater', warmth: 5, breathable: true, waterResistant: false, windResistant: false, type: 'Top' },
        { name: 'Chunky Cable Knit', warmth: 6, breathable: false, waterResistant: false, windResistant: true, type: 'Top' },
        { name: 'Thermal Base Layer', warmth: 7, breathable: false, waterResistant: false, windResistant: false, type: 'Top' }
    ],
    bottoms: [
        { name: 'Linen Shorts', warmth: 1, breathable: true, waterResistant: false, windResistant: false, type: 'Bottom' },
        { name: 'Chino Shorts', warmth: 2, breathable: true, waterResistant: false, windResistant: false, type: 'Bottom' },
        { name: 'Lightweight Chinos', warmth: 3, breathable: true, waterResistant: false, windResistant: false, type: 'Bottom' },
        { name: 'Denim Jeans', warmth: 4, breathable: false, waterResistant: false, windResistant: true, type: 'Bottom' },
        { name: 'Wool Trousers', warmth: 5, breathable: false, waterResistant: false, windResistant: true, type: 'Bottom' },
        { name: 'Thermal Lined Pants', warmth: 7, breathable: false, waterResistant: false, windResistant: true, type: 'Bottom' }
    ],
    outerwear: [
        { name: 'Denim Jacket', warmth: 3, breathable: true, waterResistant: false, windResistant: true, type: 'Outerwear' },
        { name: 'Windbreaker', warmth: 3, breathable: false, waterResistant: true, windResistant: true, type: 'Outerwear' },
        { name: 'Trench Coat', warmth: 4, breathable: false, waterResistant: true, windResistant: true, type: 'Outerwear' },
        { name: 'Leather Jacket', warmth: 5, breathable: false, waterResistant: false, windResistant: true, type: 'Outerwear' },
        { name: 'Wool Peacoat', warmth: 6, breathable: false, waterResistant: false, windResistant: true, type: 'Outerwear' },
        { name: 'Puffer Jacket', warmth: 7, breathable: false, waterResistant: true, windResistant: true, type: 'Outerwear' },
        { name: 'Heavy Parka', warmth: 8, breathable: false, waterResistant: true, windResistant: true, type: 'Outerwear' }
    ],
    accessories: [
        { name: 'Sunglasses', warmth: 0, type: 'Accessory', condition: 'Sunny' },
        { name: 'Sun Hat', warmth: 0, type: 'Accessory', condition: 'Sunny' },
        { name: 'Umbrella', warmth: 0, type: 'Accessory', condition: 'Rainy' },
        { name: 'Light Scarf', warmth: 2, type: 'Accessory' },
        { name: 'Beanie', warmth: 4, type: 'Accessory' },
        { name: 'Leather Gloves', warmth: 5, type: 'Accessory' },
        { name: 'Wool Scarf', warmth: 5, type: 'Accessory' }
    ]
};

// 2. "Feels Like" Calculation
const calculateFeelsLike = (temp, humidity, windSpeed) => {
    let feelsLike = temp;

    // Heat Index (simplified) for hot weather
    if (temp > 27 && humidity > 40) {
        feelsLike += (humidity - 40) * 0.1;
    }

    // Wind Chill (simplified) for cold weather
    if (temp < 10 && windSpeed > 5) {
        feelsLike -= (windSpeed * 0.2);
    }

    return Math.round(feelsLike);
};

// 3. Smart Recommendation Logic
export const getSmartRecommendation = (weatherData) => {
    const { temp, humidity, windSpeed, condition } = weatherData;
    const feelsLike = calculateFeelsLike(temp, humidity, windSpeed);

    let targetWarmth = 0;
    let insight = "";
    let icon = "🌤️";
    let type = "Casual";

    // Determine Target Warmth Score (1-10 scale)
    if (feelsLike >= 30) {
        targetWarmth = 1;
        insight = `It feels like ${feelsLike}°C. Prioritize breathability.`;
        icon = "🔥";
        type = "Heatwave Cool";
    } else if (feelsLike >= 25) {
        targetWarmth = 2;
        insight = "Warm and pleasant. Light fabrics are best.";
        icon = "☀️";
        type = "Summer Casual";
    } else if (feelsLike >= 20) {
        targetWarmth = 3;
        insight = "Comfortable temperature. Standard cottons work well.";
        icon = "🌤️";
        type = "Spring/Summer";
    } else if (feelsLike >= 15) {
        targetWarmth = 4;
        insight = "Mildly cool. A light layer is recommended.";
        icon = "🍂";
        type = "Fall Transition";
    } else if (feelsLike >= 10) {
        targetWarmth = 5;
        insight = "Chilly. You'll need a sweater or jacket.";
        icon = "🧥";
        type = "Fall Layers";
    } else if (feelsLike >= 5) {
        targetWarmth = 6;
        insight = `Feels like ${feelsLike}°C. Wear a warm coat.`;
        icon = "🧣";
        type = "Winter Chill";
    } else {
        targetWarmth = 7; // Max warmth
        insight = `Freezing! (${feelsLike}°C). Heavy layering required.`;
        icon = "❄️";
        type = "Deep Winter";
    }

    // Adjust for specific conditions
    if (condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('storm')) {
        insight += " Rain detected - waterproof gear selected.";
        icon = "🌧️";
    } else if (windSpeed > 20) {
        insight += " High winds - windproof layer added.";
        icon = "💨";
    }

    // Helper to find best match
    const findBestMatch = (category, targetW) => {
        return CLOTHING_DB[category].reduce((prev, curr) => {
            return (Math.abs(curr.warmth - targetW) < Math.abs(prev.warmth - targetW) ? curr : prev);
        });
    };

    // Select Items
    const top = findBestMatch('tops', targetWarmth);
    const bottom = findBestMatch('bottoms', targetWarmth);

    // Logic for Outerwear
    let outerwear = { name: 'None needed', warmth: 0 };
    if (targetWarmth >= 4) {
        outerwear = findBestMatch('outerwear', targetWarmth);
    } else if (condition.toLowerCase().includes('rain')) {
        outerwear = CLOTHING_DB.outerwear.find(i => i.name === 'Windbreaker') || outerwear;
    }

    // Logic for Accessories
    let accessories = [];
    if (targetWarmth >= 6) accessories.push('Beanie', 'Gloves');
    if (targetWarmth >= 4) accessories.push('Scarf');
    if (condition.toLowerCase().includes('rain')) accessories.push('Umbrella');
    if (condition.toLowerCase().includes('sunny') && targetWarmth <= 3) accessories.push('Sunglasses');

    if (accessories.length === 0) accessories.push('Watch', 'Bracelet');

    return {
        type,
        icon,
        insight,
        feelsLike,
        details: {
            top: top.name,
            bottom: bottom.name,
            outerwear: outerwear.name,
            accessories: accessories.join(', ')
        }
    };
};

// Keep old function for backward compatibility if needed, or redirect
export const getSeasonalRecommendation = (temp, condition) => {
    // This is a fallback wrapper if any old code calls this
    return { advice: "Update to smart recommendations", icon: "⚠️", type: "Legacy" };
};
