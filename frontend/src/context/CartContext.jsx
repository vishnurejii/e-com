import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : { items: [] };
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart(prev => {
            const existingItem = prev.items.find(item => item.product._id === product._id);
            if (existingItem) {
                return {
                    ...prev,
                    items: prev.items.map(item =>
                        item.product._id === product._id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    )
                };
            }
            return {
                ...prev,
                items: [...prev.items, { product, quantity: 1 }]
            };
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => ({
            ...prev,
            items: prev.items.filter(item => item.product._id !== productId)
        }));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) return removeFromCart(productId);
        setCart(prev => ({
            ...prev,
            items: prev.items.map(item =>
                item.product._id === productId ? { ...item, quantity } : item
            )
        }));
    };

    const cartCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, cartCount, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
};
