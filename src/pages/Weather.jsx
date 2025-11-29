import React, { useState, useEffect } from 'react';
import { Search, MapPin, Wind, Droplets, Thermometer, Shirt, Umbrella, Sun, Cloud, Sparkles } from 'lucide-react';
import { getWeather, getSmartRecommendation } from '../utils/weatherUtils';

const Weather = () => {
    const [location, setLocation] = useState('New York');
    const [searchQuery, setSearchQuery] = useState('');
    const [weather, setWeather] = useState(null);
    const [recommendation, setRecommendation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchWeather = async (loc) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getWeather(loc);
            setWeather(data);
            // Use the new Smart Recommendation Engine
            setRecommendation(getSmartRecommendation(data));
        } catch (error) {
            console.error('Failed to fetch weather', error);
            setError('Failed to load weather data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather(location);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setLocation(searchQuery);
            fetchWeather(searchQuery);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Weather & Style</h1>
                    <p className="text-slate-500 mt-1">AI-Powered Outfit Recommendations</p>
                </div>
                <form onSubmit={handleSearch} className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder="Search city (e.g., London, Dubai)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                </form>
            </div>

            {loading ? (
                <div className="h-96 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            ) : error ? (
                <div className="text-center py-20 text-red-500 bg-red-50 rounded-3xl">
                    <p className="text-xl font-bold mb-2">Oops!</p>
                    <p>{error}</p>
                    <button onClick={() => fetchWeather(location)} className="mt-4 text-primary-600 hover:underline">Try Again</button>
                </div>
            ) : weather && recommendation ? (
                <div className="space-y-8">
                    {/* Current Weather Card */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-2 mb-2 opacity-90">
                                    <MapPin size={20} />
                                    <span className="text-lg font-medium">{weather.location}</span>
                                </div>
                                <h2 className="text-7xl font-bold mb-2">{weather.temp}°</h2>
                                <p className="text-xl opacity-90 mb-1">Feels like {recommendation.feelsLike}°</p>
                                <p className="text-2xl font-medium text-blue-100">{weather.condition}</p>
                            </div>

                            <div className="text-9xl animate-float">
                                {recommendation.icon}
                            </div>

                            <div className="grid grid-cols-2 gap-6 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                                <div className="flex items-center gap-3">
                                    <Wind className="text-blue-200" />
                                    <div>
                                        <p className="text-xs text-blue-200">Wind</p>
                                        <p className="font-bold">{weather.windSpeed} km/h</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Droplets className="text-blue-200" />
                                    <div>
                                        <p className="text-xs text-blue-200">Humidity</p>
                                        <p className="font-bold">{weather.humidity}%</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Circles */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                    </div>

                    {/* Smart Style Recommendations */}
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Main Advice */}
                        <div className="md:col-span-3 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-4 border-primary-500">
                            <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                                <Sparkles className="text-primary-500" />
                                AI Style Insight
                            </h3>
                            <p className="text-slate-600 text-lg">{recommendation.insight}</p>
                        </div>

                        {/* Detailed Breakdown */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                <Shirt size={20} />
                            </div>
                            <h4 className="font-semibold text-slate-900 mb-1">Top & Bottom</h4>
                            <p className="text-sm text-slate-600 mb-2">{recommendation.details.top}</p>
                            <p className="text-sm text-slate-600">{recommendation.details.bottom}</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-4">
                                <Cloud size={20} />
                            </div>
                            <h4 className="font-semibold text-slate-900 mb-1">Outerwear</h4>
                            <p className="text-sm text-slate-600">{recommendation.details.outerwear}</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-4">
                                <Umbrella size={20} />
                            </div>
                            <h4 className="font-semibold text-slate-900 mb-1">Accessories</h4>
                            <p className="text-sm text-slate-600">{recommendation.details.accessories}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 text-slate-400">
                    <p>Search for a location to see weather and style recommendations.</p>
                </div>
            )}
        </div>
    );
};

export default Weather;
