import React, { useState } from 'react';
import { useWardrobe } from '../context/WardrobeContext';
import { Plus, X, Filter } from 'lucide-react';

const Wardrobe = () => {
    const { clothes, addCloth, categories, deleteCloth } = useWardrobe();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCloth, setNewCloth] = useState({
        name: '',
        category: categories[0],
        image: ''
    });

    const filteredClothes = selectedCategory === 'All'
        ? clothes
        : clothes.filter(item => item.category === selectedCategory);

    const handleAddCloth = (e) => {
        e.preventDefault();
        // For demo purposes, if no image URL is provided, use a placeholder
        const clothToAdd = {
            ...newCloth,
            image: newCloth.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80'
        };
        addCloth(clothToAdd);
        setIsModalOpen(false);
        setNewCloth({ name: '', category: categories[0], image: '' });
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">My Wardrobe</h1>
                    <p className="text-slate-500 mt-1">Manage and organize your collection</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center gap-2 w-fit"
                >
                    <Plus size={20} />
                    Add New Item
                </button>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                <button
                    onClick={() => setSelectedCategory('All')}
                    className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${selectedCategory === 'All'
                        ? 'bg-slate-900 text-white shadow-lg'
                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                        }`}
                >
                    All Items
                </button>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${selectedCategory === cat
                            ? 'bg-slate-900 text-white shadow-lg'
                            : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredClothes.map((item) => (
                    <div key={item.id} className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
                        <div className="aspect-square overflow-hidden bg-slate-100">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                            <button
                                onClick={() => deleteCloth(item.id)}
                                className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 transform translate-y-2 group-hover:translate-y-0"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-4">
                            <p className="text-xs font-medium text-primary-600 mb-1">{item.category}</p>
                            <h3 className="font-semibold text-slate-900">{item.name}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-slide-up">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900">Add New Item</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleAddCloth} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Item Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                                    value={newCloth.name}
                                    onChange={e => setNewCloth({ ...newCloth, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                <select
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                                    value={newCloth.category}
                                    onChange={e => setNewCloth({ ...newCloth, category: e.target.value })}
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Image</label>
                                <div className="flex items-center gap-4">
                                    <div className="relative w-24 h-24 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center group">
                                        {newCloth.image ? (
                                            <img src={newCloth.image} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <Plus className="text-slate-400" />
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setNewCloth({ ...newCloth, image: reader.result });
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-slate-500 mb-2">Upload an image of your cloth.</p>
                                        <button
                                            type="button"
                                            className="text-sm text-primary-600 font-medium hover:text-primary-700"
                                            onClick={() => document.querySelector('input[type="file"]').click()}
                                        >
                                            Choose File
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 btn-primary"
                                >
                                    Add Item
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Wardrobe;
