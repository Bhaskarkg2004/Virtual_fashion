import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Ruler, Heart, Save, Loader2 } from 'lucide-react';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');
    const [successMessage, setSuccessMessage] = useState('');

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        bio: user?.bio || '',
        profileImage: user?.profileImage || '',
        measurements: {
            height: user?.measurements?.height || '',
            weight: user?.measurements?.weight || '',
            shirtSize: user?.measurements?.shirtSize || '',
            pantSize: user?.measurements?.pantSize || '',
            shoeSize: user?.measurements?.shoeSize || '',
        },
        preferences: {
            styleArchetype: user?.preferences?.styleArchetype || '',
            favoriteColors: user?.preferences?.favoriteColors?.join(', ') || '',
        }
    });

    const handleInputChange = (section, field, value) => {
        if (section === 'root') {
            setFormData(prev => ({ ...prev, [field]: value }));
        } else {
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage('');

        try {
            // Parse favorite colors back to array
            const updatedData = {
                ...formData,
                preferences: {
                    ...formData.preferences,
                    favoriteColors: formData.preferences.favoriteColors.split(',').map(c => c.trim()).filter(c => c)
                }
            };

            await updateProfile(updatedData);
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Failed to update profile', error);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'personal', label: 'Personal Info', icon: User },
        { id: 'measurements', label: 'Measurements', icon: Ruler },
        { id: 'preferences', label: 'Style Preferences', icon: Heart },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
                <p className="text-slate-500 mt-1">Manage your personal details and preferences</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Tabs */}
                <div className="w-full md:w-64 flex-shrink-0 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${activeTab === tab.id
                                ? 'bg-white text-primary-600 shadow-md font-medium'
                                : 'text-slate-600 hover:bg-white/50 hover:text-slate-900'
                                }`}
                        >
                            <tab.icon size={20} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl space-y-6">
                        {successMessage && (
                            <div className="bg-green-50 text-green-600 p-4 rounded-xl flex items-center gap-2 animate-fade-in">
                                <div className="w-2 h-2 bg-green-500 rounded-full" />
                                {successMessage}
                            </div>
                        )}

                        {activeTab === 'personal' && (
                            <div className="space-y-4 animate-fade-in">
                                <h2 className="text-xl font-semibold text-slate-900 mb-4">Personal Information</h2>

                                <div className="flex items-center gap-6 mb-6">
                                    <div className="relative w-24 h-24 rounded-full bg-slate-100 overflow-hidden border-2 border-white shadow-md group">
                                        {formData.profileImage ? (
                                            <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                <User size={40} />
                                            </div>
                                        )}
                                        <label className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center cursor-pointer transition-colors">
                                            <div className="opacity-0 group-hover:opacity-100 text-white text-xs font-medium">Change</div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            handleInputChange('root', 'profileImage', reader.result);
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-slate-900">Profile Photo</h3>
                                        <p className="text-sm text-slate-500">Click on the image to upload a new photo.</p>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('root', 'name', e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            disabled
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange('root', 'phone', e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                                        <textarea
                                            value={formData.bio}
                                            onChange={(e) => handleInputChange('root', 'bio', e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none h-24 resize-none"
                                            placeholder="Tell us a bit about your style journey..."
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'measurements' && (
                            <div className="space-y-4 animate-fade-in">
                                <h2 className="text-xl font-semibold text-slate-900 mb-4">Body Measurements</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Height (cm)</label>
                                        <input
                                            type="number"
                                            value={formData.measurements.height}
                                            onChange={(e) => handleInputChange('measurements', 'height', e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Weight (kg)</label>
                                        <input
                                            type="number"
                                            value={formData.measurements.weight}
                                            onChange={(e) => handleInputChange('measurements', 'weight', e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Shirt Size</label>
                                        <select
                                            value={formData.measurements.shirtSize}
                                            onChange={(e) => handleInputChange('measurements', 'shirtSize', e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                                        >
                                            <option value="">Select Size</option>
                                            <option value="XS">XS</option>
                                            <option value="S">S</option>
                                            <option value="M">M</option>
                                            <option value="L">L</option>
                                            <option value="XL">XL</option>
                                            <option value="XXL">XXL</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Pant Size (Waist)</label>
                                        <input
                                            type="number"
                                            value={formData.measurements.pantSize}
                                            onChange={(e) => handleInputChange('measurements', 'pantSize', e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Shoe Size (US)</label>
                                        <input
                                            type="number"
                                            value={formData.measurements.shoeSize}
                                            onChange={(e) => handleInputChange('measurements', 'shoeSize', e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'preferences' && (
                            <div className="space-y-4 animate-fade-in">
                                <h2 className="text-xl font-semibold text-slate-900 mb-4">Style Preferences</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Style Archetype</label>
                                        <select
                                            value={formData.preferences.styleArchetype}
                                            onChange={(e) => handleInputChange('preferences', 'styleArchetype', e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                                        >
                                            <option value="">Select Archetype</option>
                                            <option value="Casual">Casual</option>
                                            <option value="Formal">Formal</option>
                                            <option value="Streetwear">Streetwear</option>
                                            <option value="Vintage">Vintage</option>
                                            <option value="Minimalist">Minimalist</option>
                                            <option value="Bohemian">Bohemian</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Favorite Colors (comma separated)</label>
                                        <input
                                            type="text"
                                            value={formData.preferences.favoriteColors}
                                            onChange={(e) => handleInputChange('preferences', 'favoriteColors', e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                                            placeholder="e.g. Blue, Black, White"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="pt-4 border-t border-slate-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
