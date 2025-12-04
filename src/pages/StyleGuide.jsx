import React, { useState } from 'react';
import { Upload, Loader2, CheckCircle, Palette } from 'lucide-react';

const StyleGuide = () => {
    const [image, setImage] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                setResult(null);
            };
            reader.readAsDataURL(file);
        }
    };

    // Backend connection check could go here, but for now we assume it's running
    const modelLoaded = true;

    const analyzeSkinTone = async () => {
        if (!image) return;

        setAnalyzing(true);
        try {
            // Convert base64 to blob
            const response = await fetch(image);
            const blob = await response.blob();

            const formData = new FormData();
            formData.append('image', blob, 'upload.jpg');

            // Use localhost for local development
            const apiResponse = await fetch('http://localhost:5000/predict-skin-tone', {
                method: 'POST',
                body: formData,
            });

            const data = await apiResponse.json();

            if (!apiResponse.ok) {
                throw new Error(data.error || 'Failed to analyze image');
            }
            // Format the backend response to match our frontend structure
            const formattedResult = {
                skinTone: data.skinTone,
                skinToneHex: data.skinToneHex || '#e0ac69', // Use the representative color sent by backend
                description: `Based on our model analysis, your skin tone is classified as ${data.skinTone}. This suggests a ${data.season} seasonal palette.`,
                recommendations: data.colors, // Backend now sends {name, hex} objects
                avoid: data.avoid || [], // Backend now sends {name, hex} objects
                combinations: data.combinations || []
            };

            setResult(formattedResult);
        } catch (error) {
            console.error(error);
            alert('Error connecting to AI Server. Make sure "python app.py" is running in the backend folder.\n\nDetails: ' + error.message);
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-900">Style Assistant</h1>
                <p className="text-slate-500 mt-2">Upload your photo to discover your perfect color palette</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Upload Section */}
                <div className="glass-panel p-6 rounded-2xl">
                    <div className="aspect-[3/4] bg-slate-100 rounded-xl overflow-hidden relative border-2 border-dashed border-slate-300 hover:border-primary-400 transition-colors group">
                        {image ? (
                            <img src={image} alt="Uploaded" className="w-full h-full object-cover" />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                                <Upload size={48} className="mb-4 group-hover:scale-110 transition-transform" />
                                <p className="font-medium">Click to upload photo</p>
                                <p className="text-xs mt-1">JPG, PNG up to 5MB</p>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </div>

                    <button
                        onClick={analyzeSkinTone}
                        disabled={!image || analyzing || !modelLoaded}
                        className={`w-full mt-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${!image || analyzing || !modelLoaded
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg hover:shadow-primary-500/30'
                            }`}
                    >
                        {analyzing ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Analyzing Skin Tone...
                            </>
                        ) : !modelLoaded ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Loading AI Models...
                            </>
                        ) : (
                            <>
                                <Palette size={20} />
                                Analyze My Style
                            </>
                        )}
                    </button>
                </div>

                {/* Results Section */}
                <div className="space-y-6">
                    {!result ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <Palette size={32} />
                            </div>
                            <p className="text-center">Upload a photo and click analyze to see your personalized color recommendations</p>
                        </div>
                    ) : (
                        <div className="animate-fade-in space-y-6">
                            <div className="glass-panel p-6 rounded-2xl border-l-4 border-primary-500">
                                <div className="flex items-center gap-3 mb-2">
                                    <CheckCircle className="text-green-500" size={24} />
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-xl font-bold text-slate-900">{result.skinTone}</h2>
                                        <div
                                            className="w-8 h-8 rounded-full shadow-sm border-2 border-white ring-1 ring-slate-200"
                                            style={{ backgroundColor: result.skinToneHex }}
                                            title="Detected Skin Tone"
                                        />
                                    </div>
                                </div>
                                <p className="text-slate-600">{result.description}</p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-slate-900 mb-3">Recommended Colors</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {result.recommendations.map((color) => (
                                        <div key={color.name} className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center gap-2 hover:scale-105 transition-transform">
                                            <div
                                                className="w-12 h-12 rounded-full shadow-inner"
                                                style={{ backgroundColor: color.hex }}
                                            />
                                            <span className="text-xs font-medium text-slate-700">{color.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Outfit Combinations */}
                            {result.combinations && (
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-3">Outfit Ideas</h3>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {result.combinations.map((combo, idx) => (
                                            <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
                                                <div>
                                                    <h4 className="font-medium text-slate-900">{combo.name}</h4>
                                                    <p className="text-xs text-slate-500">{combo.description}</p>
                                                </div>
                                                <div className="flex -space-x-3">
                                                    {combo.colors.map((color, i) => (
                                                        <div
                                                            key={i}
                                                            className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                                                            style={{ backgroundColor: color?.hex || '#ccc' }}
                                                            title={color?.name}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <h3 className="font-semibold text-slate-900 mb-3">Colors to Avoid</h3>
                                <div className="flex flex-wrap gap-2">
                                    {result.avoid.map((color) => (
                                        <div key={color.name} className="flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium border border-red-100">
                                            <div className="w-3 h-3 rounded-full bg-current" style={{ backgroundColor: color.hex }} />
                                            {color.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StyleGuide;
