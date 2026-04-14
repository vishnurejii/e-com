import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Store = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resCats = await axios.get('http://localhost:5000/api/categories');
                setCategories(resCats.data);

                const url = selectedCategory 
                    ? `http://localhost:5000/api/products?category=${selectedCategory}`
                    : 'http://localhost:5000/api/products';
                const resProds = await axios.get(url);
                setProducts(resProds.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [selectedCategory]);

    return (
        <div className="container" style={{ padding: '4rem 1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Store</h1>
                <select 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border)', fontWeight: 600, outline: 'none' }}
                >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.category_name}</option>
                    ))}
                </select>
            </div>
            
            <div className="product-grid" style={{ padding: 0 }}>
                {products.length > 0 ? (
                    products.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))
                ) : (
                    <p>No products found in this category.</p>
                )}
            </div>
        </div>
    );
};

export default Store;
