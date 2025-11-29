import React, { createContext, useContext, useState, useEffect } from 'react';

const WardrobeContext = createContext();

export const useWardrobe = () => useContext(WardrobeContext);

export const WardrobeProvider = ({ children }) => {
    const [clothes, setClothes] = useState([]);

    // Mock initial data
    useEffect(() => {
        const storedClothes = localStorage.getItem('wardrobe');
        if (storedClothes) {
            setClothes(JSON.parse(storedClothes));
        } else {
            // Default mock data
            const initialData = [
                { id: 1, name: 'Running Shoes', category: 'Sports', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80' },
                { id: 2, name: 'White Shirt', category: 'Formals', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=300&q=80' },
                { id: 3, name: 'Cozy Hoodie', category: 'Home Wear', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=300&q=80' },
            ];
            setClothes(initialData);
            localStorage.setItem('wardrobe', JSON.stringify(initialData));
        }
    }, []);

    const addCloth = (cloth) => {
        const newCloth = { ...cloth, id: Date.now() };
        const updatedClothes = [...clothes, newCloth];
        setClothes(updatedClothes);
        localStorage.setItem('wardrobe', JSON.stringify(updatedClothes));
    };

    const deleteCloth = (id) => {
        const updatedClothes = clothes.filter(item => item.id !== id);
        setClothes(updatedClothes);
        localStorage.setItem('wardrobe', JSON.stringify(updatedClothes));
    };

    const getClothesByCategory = (category) => {
        return clothes.filter(item => item.category === category);
    };

    const categories = ['Top', 'Bottom', 'Sports', 'Formals', 'Home Wear', 'Casual', 'Party'];

    const value = {
        clothes,
        addCloth,
        deleteCloth,
        getClothesByCategory,
        categories
    };

    return (
        <WardrobeContext.Provider value={value}>
            {children}
        </WardrobeContext.Provider>
    );
};
