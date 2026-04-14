import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/products');
                setProducts(data.slice(0, 8));
            } catch (error) {
                console.error(error);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div>
            <section className="hero">
                <div className="container">
                    <h1>Premium Quality Products</h1>
                    <p>Discover our curated collection of high-end essentials designed for modern living.</p>
                    <a href="/store" className="btn btn-primary" onClick={(e) => { e.preventDefault(); window.location.href='/store' }}>Shop Now</a>
                </div>
            </section>

            <div className="container">
                <h2 style={{ marginTop: '4rem', fontSize: '2rem', fontWeight: 800 }}>Featured Products</h2>
                <div className="product-grid">
                    {products.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                    {products.length === 0 && <p>Loading featured products...</p>}
                </div>
            </div>
        </div>
    );
};

export default Home;
