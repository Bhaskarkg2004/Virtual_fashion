import React, { useState } from 'react';
import { Upload, Loader2, Wand2, RefreshCw } from 'lucide-react';

const VirtualTryOn = () => {
    const [personImage, setPersonImage] = useState(null);
    const [clothImage, setClothImage] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [resultImage, setResultImage] = useState(null);

    const handleImageUpload = (setter) => (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setter(reader.result);
                setResultImage(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const generateTryOn = () => {
        setGenerating(true);
        // Mock ML generation delay
        setTimeout(() => {
            setGenerating(false);
            // For demo, we just show the person image again but ideally this would be the merged result
            // In a real app, this would be the response from the ML backend
            setResultImage(personImage);
        }, 3000);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-900">Virtual Try-On</h1>
                <p className="text-slate-500 mt-2">See how clothes look on you before you buy</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 items-start">
                {/* Input Section */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Person Upload */}
                    <div className="glass-panel p-4 rounded-2xl">
                        <h3 className="font-semibold text-slate-900 mb-3">1. Your Photo</h3>
                        <div className="aspect-[3/4] bg-slate-100 rounded-xl overflow-hidden relative border-2 border-dashed border-slate-300 hover:border-primary-400 transition-colors group">
                            {personImage ? (
                                <img src={personImage} alt="Person" className="w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                                    <Upload size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                                    <p className="text-sm font-medium">Upload your photo</p>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload(setPersonImage)}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Cloth Upload */}
                    <div className="glass-panel p-4 rounded-2xl">
                        <h3 className="font-semibold text-slate-900 mb-3">2. Cloth Photo</h3>
                        <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden relative border-2 border-dashed border-slate-300 hover:border-primary-400 transition-colors group">
                            {clothImage ? (
                                <img src={clothImage} alt="Cloth" className="w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                                    <Upload size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                                    <p className="text-sm font-medium">Upload cloth photo</p>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload(setClothImage)}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>

                    <button
                        onClick={generateTryOn}
                        disabled={!personImage || !clothImage || generating}
                        className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${!personImage || !clothImage || generating
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg hover:shadow-primary-500/30'
                            }`}
                    >
                        {generating ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Wand2 size={20} />
                                Generate Try-On
                            </>
                        )}
                    </button>
                </div>

                {/* Result Section */}
                <div className="lg:col-span-2">
                    <div className="glass-panel p-6 rounded-2xl h-full min-h-[600px] flex flex-col">
                        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <RefreshCw size={20} className="text-primary-600" />
                            Generated Result
                        </h3>

                        <div className="flex-1 bg-slate-900/5 rounded-xl overflow-hidden relative flex items-center justify-center">
                            {generating ? (
                                <div className="text-center space-y-4">
                                    <div className="relative w-24 h-24 mx-auto">
                                        <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
                                    </div>
                                    <p className="text-slate-600 font-medium animate-pulse">Fitting the cloth...</p>
                                </div>
                            ) : resultImage ? (
                                <div className="relative w-full h-full animate-fade-in">
                                    <img src={resultImage} alt="Result" className="w-full h-full object-contain" />
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm backdrop-blur-md">
                                        Mock Result Generated
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-slate-400 max-w-xs">
                                    <Wand2 size={48} className="mx-auto mb-4 opacity-50" />
                                    <p className="font-medium">Ready to create magic</p>
                                    <p className="text-sm mt-2">Upload both images and click generate to see the result</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VirtualTryOn;
