import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored user on mount
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        // Mock login logic
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email && password) {
                    const mockUser = {
                        id: '1',
                        name: 'John Doe',
                        email,
                        phone: '+1 (555) 123-4567',
                        bio: 'Fashion enthusiast and tech lover.',
                        measurements: {
                            height: '175',
                            weight: '70',
                            shirtSize: 'M',
                            pantSize: '32',
                            shoeSize: '9'
                        },
                        preferences: {
                            styleArchetype: 'Casual',
                            favoriteColors: ['Blue', 'Black', 'White']
                        },
                        profileImage: null
                    };
                    setUser(mockUser);
                    localStorage.setItem('user', JSON.stringify(mockUser));
                    resolve(mockUser);
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 1000);
        });
    };

    const signup = (name, email, password) => {
        // Mock signup logic
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (name && email && password) {
                    const mockUser = {
                        id: '1',
                        name,
                        email,
                        phone: '',
                        bio: '',
                        measurements: {
                            height: '',
                            weight: '',
                            shirtSize: '',
                            pantSize: '',
                            shoeSize: ''
                        },
                        preferences: {
                            styleArchetype: '',
                            favoriteColors: []
                        },
                        profileImage: null
                    };
                    setUser(mockUser);
                    localStorage.setItem('user', JSON.stringify(mockUser));
                    resolve(mockUser);
                } else {
                    reject(new Error('Invalid data'));
                }
            }, 1000);
        });
    };

    const updateProfile = (updatedData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newUser = { ...user, ...updatedData };
                setUser(newUser);
                localStorage.setItem('user', JSON.stringify(newUser));
                resolve(newUser);
            }, 500);
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const value = {
        user,
        login,
        signup,
        logout,
        updateProfile,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
