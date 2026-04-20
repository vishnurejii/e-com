import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchWishlist = useCallback(async () => {
        if (!user || !user.token) {
            setWishlist([]);
            return;
        }
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/wishlist', config);
            setWishlist(data.products || []);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const addToWishlist = async (productId) => {
        if (!user) {
            alert('Please login to add items to your wishlist');
            return;
        }
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('http://localhost:5000/api/wishlist', { productId }, config);
            // Refresh wishlist after adding
            fetchWishlist();
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            alert('Failed to add item to wishlist');
        }
    };

    const removeFromWishlist = async (productId) => {
        if (!user) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`http://localhost:5000/api/wishlist/${productId}`, config);
            // Update local state directly for immediate feedback
            setWishlist(prev => prev.filter(p => p._id !== productId));
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
    };

    const toggleWishlist = async (productId) => {
        if (isInWishlist(productId)) {
            await removeFromWishlist(productId);
        } else {
            await addToWishlist(productId);
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.some(p => p._id === productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, loading, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};
