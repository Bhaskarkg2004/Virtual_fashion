import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWardrobe } from '../context/WardrobeContext';
import { Plus, Camera, Shirt, TrendingUp, Sparkles, ArrowRight, Palette, Cloud, Thermometer } from 'lucide-react';
import { getWeather, getSeasonalRecommendation } from '../utils/weatherUtils';

const WeatherWidget = () => {
    const [weather, setWeather] = useState(null);
    const [recommendation, setRecommendation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const data = await getWeather();
                setWeather(data);
                setRecommendation(getSeasonalRecommendation(data.temp, data.condition));
            } catch (error) {
                console.error('Failed to fetch weather', error);
            } finally {
                setLoading(false);
            }
        };
        fetchWeather();
    }, []);

    if (loading) return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-slate-200 rounded w-3/4"></div>
        </div>
    );

    if (!weather) return (
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-red-600">
            <p>Unable to load weather data.</p>
        </div>
    );

    return (
        <div className="bg-gradient-to-br from-sky-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg shadow-blue-500/30 relative overflow-hidden">
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Cloud className="text-white/80" size={20} />
                        <span className="text-sm font-medium text-white/90">Weather & Style</span>
                    </div>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                        {weather.location.split(',')[0]}
                    </span>
                </div>

                <div className="flex items-end gap-4 mb-6">
                    <div>
                        <h3 className="text-4xl font-bold">{weather.temp}°</h3>
                        <p className="text-blue-100 text-sm">{weather.condition}</p>
                    </div>
                    <div className="text-5xl">{recommendation.icon}</div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                    <p className="text-sm font-medium mb-1 text-blue-50">{recommendation.type}</p>
                    <p className="text-xs text-blue-100 leading-relaxed">
                        {recommendation.advice}
                    </p>
                </div>
            </div>

            {/* Decorative Background Circles */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl"></div>
        </div>
    );
};

const Dashboard = () => {
    const { user } = useAuth();
    const { clothes, categories } = useWardrobe();

    // Stats
    const totalItems = clothes.length;
    const totalCategories = categories.length;
    const recentItems = [...clothes].reverse().slice(0, 4);

    // Mock Outfit of the Day
    const getOutfitOfTheDay = () => {
        if (clothes.length < 2) return null;
        // Simple random selection for demo
        const top = clothes[Math.floor(Math.random() * clothes.length)];
        let bottom = clothes[Math.floor(Math.random() * clothes.length)];

        // Try to get a different item
        while (bottom.id === top.id && clothes.length > 1) {
            bottom = clothes[Math.floor(Math.random() * clothes.length)];
        }

        return { top, bottom };
    };

    const outfitOfTheDay = getOutfitOfTheDay();

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Welcome Section */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Hello, {user?.name?.split(' ')[0] || 'User'}! 👋
                    </h1>
                    <p className="text-slate-500 mt-1">Here's what's happening with your wardrobe today.</p>
                </div>
                <p className="text-sm font-medium text-slate-400 hidden md:block">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
            </div>

            {/* ... rest of the component ... */}


            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <Shirt size={24} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Total Items</p>
                        <h3 className="text-2xl font-bold text-slate-900">{totalItems}</h3>
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Categories</p>
                        <h3 className="text-2xl font-bold text-slate-900">{totalCategories}</h3>
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                        <Sparkles size={24} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Style Score</p>
                        <h3 className="text-2xl font-bold text-slate-900">85/100</h3>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Quick Actions */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Link to="/wardrobe" className="group p-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl text-white shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all flex items-center justify-between">
                                <div>
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <Plus size={20} />
                                    </div>
                                    <h3 className="font-semibold">Add New Cloth</h3>
                                    <p className="text-primary-100 text-sm">Expand your collection</p>
                                </div>
                                <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0" />
                            </Link>

                            <Link to="/style-guide" className="group p-4 bg-white border border-slate-200 rounded-2xl hover:border-primary-200 hover:bg-primary-50 transition-all flex items-center justify-between">
                                <div>
                                    <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-white group-hover:text-primary-600 transition-colors">
                                        <Palette size={20} />
                                    </div>
                                    <h3 className="font-semibold text-slate-900">Style Guide</h3>
                                    <p className="text-slate-500 text-sm">Find your colors</p>
                                </div>
                                <ArrowRight className="text-slate-300 group-hover:text-primary-600 transition-colors" />
                            </Link>
                        </div>
                    </section>

                    {/* Recent Additions */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-slate-900">Recent Additions</h2>
                            <Link to="/wardrobe" className="text-primary-600 text-sm font-medium hover:text-primary-700">View All</Link>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {recentItems.map((item) => (
                                <div key={item.id} className="group relative aspect-square bg-slate-100 rounded-xl overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                                        <p className="text-white text-xs font-medium truncate">{item.name}</p>
                                        <p className="text-white/80 text-[10px]">{item.category}</p>
                                    </div>
                                </div>
                            ))}
                            {recentItems.length === 0 && (
                                <div className="col-span-4 text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    No items yet. Start adding!
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-8">
                    {/* Weather Widget */}
                    <WeatherWidget />

                    {/* Outfit of the Day */}
                    <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-full">
                        <div className="flex items-center gap-2 mb-6">
                            <Sparkles className="text-amber-500" size={20} />
                            <h2 className="text-xl font-bold text-slate-900">Outfit of the Day</h2>
                        </div>

                        {outfitOfTheDay ? (
                            <div className="space-y-4">
                                <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 relative group">
                                    <img src={outfitOfTheDay.top.image} alt="Top" className="w-full h-full object-cover" />
                                    <span className="absolute top-2 left-2 bg-black/50 backdrop-blur text-white text-xs px-2 py-1 rounded-md">Top</span>
                                </div>
                                <div className="flex justify-center text-slate-300">
                                    <Plus size={24} />
                                </div>
                                <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 relative group">
                                    <img src={outfitOfTheDay.bottom.image} alt="Bottom" className="w-full h-full object-cover" />
                                    <span className="absolute top-2 left-2 bg-black/50 backdrop-blur text-white text-xs px-2 py-1 rounded-md">Bottom</span>
                                </div>
                                <button className="w-full mt-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                                    Shuffle Outfit
                                </button>
                            </div>
                        ) : (
                            <div className="text-center text-slate-400 py-10">
                                <p>Add more items to generate outfits!</p>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
