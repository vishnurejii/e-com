import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const Store = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [keyword, setKeyword] = useState('');
    const [sort, setSort] = useState('-createdAt');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const resCats = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories`);
            setCategories(resCats.data);

            let url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products?sort=${sort}`;
            if (selectedCategory) url += `&category=${selectedCategory}`;
            if (keyword) url += `&keyword=${keyword}`;
            if (minPrice) url += `&minPrice=${minPrice}`;
            if (maxPrice) url += `&maxPrice=${maxPrice}`;

            const resProds = await axios.get(url);
            setProducts(resProds.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedCategory, sort, keyword, minPrice, maxPrice]);

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <div style={{ marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '2rem' }}>Our Collection</h1>
                
                {/* Search & Filter Bar */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', background: 'white', padding: '1.5rem', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                    {/* Search */}
                    <div style={{ flexGrow: 1, minWidth: '300px', position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} size={20} />
                        <input 
                            type="text" 
                            placeholder="Search products..." 
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 3rem', borderRadius: '12px', border: '1px solid var(--border)', outline: 'none', fontSize: '1rem' }}
                        />
                    </div>

                    {/* Category Select */}
                    <div style={{ minWidth: '200px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <SlidersHorizontal size={18} style={{ opacity: 0.5 }} />
                        <select 
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            style={{ flexGrow: 1, padding: '0.875rem', borderRadius: '12px', border: '1px solid var(--border)', fontWeight: 600, outline: 'none', cursor: 'pointer' }}
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.category_name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Sorting */}
                    <div style={{ minWidth: '200px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ArrowUpDown size={18} style={{ opacity: 0.5 }} />
                        <select 
                            onChange={(e) => setSort(e.target.value)}
                            style={{ flexGrow: 1, padding: '0.875rem', borderRadius: '12px', border: '1px solid var(--border)', fontWeight: 600, outline: 'none', cursor: 'pointer' }}
                        >
                            <option value="-createdAt">Newest First</option>
                            <option value="price">Price: Low to High</option>
                            <option value="-price">Price: High to Low</option>
                            <option value="-rating">Top Rated</option>
                        </select>
                    </div>

                    {/* Price Filter Toggle/Inputs (Simplified) */}
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input 
                            type="number" 
                            placeholder="Min" 
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            style={{ width: '80px', padding: '0.875rem', borderRadius: '12px', border: '1px solid var(--border)', outline: 'none' }}
                        />
                        <span>-</span>
                        <input 
                            type="number" 
                            placeholder="Max" 
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            style={{ width: '80px', padding: '0.875rem', borderRadius: '12px', border: '1px solid var(--border)', outline: 'none' }}
                        />
                    </div>
                </div>
            </div>
            
            {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem' }}>Checking inventory...</div>
            ) : (
                <div className="product-grid" style={{ padding: 0 }}>
                    {products.length > 0 ? (
                        products.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    ) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem', background: '#f8fafc', borderRadius: '32px', border: '1px dashed var(--border)' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>No products match your current filters.</p>
                            <button onClick={() => { setKeyword(''); setSelectedCategory(''); setMinPrice(''); setMaxPrice(''); }} className="btn" style={{ marginTop: '1rem', textDecoration: 'underline' }}>Clear All Filters</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Store;
