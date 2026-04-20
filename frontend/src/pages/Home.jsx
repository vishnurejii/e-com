import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [scrollProgress, setScrollProgress] = useState(0);

    // Premium assets generated for the hero
    const premiumAssets = [
        { id: 'p1', img: '/C:/Users/vishn/.gemini/antigravity/brain/9f05c602-526b-4179-b23b-94f2cb92187b/hero_product_1_1776694819931.png', pos: { x: -35, y: -25 }, scale: 1.2 },
        { id: 'p2', img: '/C:/Users/vishn/.gemini/antigravity/brain/9f05c602-526b-4179-b23b-94f2cb92187b/hero_product_2_1776694847643.png', pos: { x: 35, y: -20 }, scale: 0.9 },
        { id: 'p3', img: '/C:/Users/vishn/.gemini/antigravity/brain/9f05c602-526b-4179-b23b-94f2cb92187b/hero_product_3_1776694871476.png', pos: { x: -30, y: 30 }, scale: 1.1 },
        { id: 'p4', img: '/C:/Users/vishn/.gemini/antigravity/brain/9f05c602-526b-4179-b23b-94f2cb92187b/hero_product_2_1776694847643.png', pos: { x: 40, y: 25 }, scale: 0.8 },
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/products');
                setProducts(data.slice(0, 8));
            } catch (error) {
                console.error(error);
            }
        };

        const handleScroll = () => {
            const currentScroll = window.scrollY;
            const maxScroll = window.innerHeight * 0.8;
            setScrollProgress(Math.min(currentScroll / maxScroll, 1));
        };

        fetchProducts();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div>
            <section className="hero">
                <div className="product-cloud">
                    {(products.length > 0 ? products.slice(0, 4) : []).concat(premiumAssets).map((item, index) => {
                        const isDynamic = !!item._id;
                        const initialX = isDynamic ? (index % 2 === 0 ? -40 : 40) : item.pos.x;
                        const initialY = isDynamic ? (index < 2 ? -30 : 30) : item.pos.y;
                        
                        // Calculated animation properties based on scroll
                        const spreadFactor = 200 * scrollProgress;
                        const x = initialX + (initialX > 0 ? spreadFactor : -spreadFactor);
                        const y = initialY + (initialY > 0 ? spreadFactor : -spreadFactor);
                        const opacity = 1 - scrollProgress;
                        const rotation = (index % 2 === 0 ? 1 : -1) * 15 * scrollProgress;

                        return (
                            <img 
                                key={item._id || item.id}
                                src={isDynamic ? item.image : item.img} 
                                className="floating-img"
                                style={{ 
                                    transform: `translate(calc(-50% + ${x}vw), calc(-50% + ${y}vh)) scale(${item.scale || 1}) rotate(${rotation}deg)`,
                                    opacity: opacity,
                                    transition: scrollProgress === 0 ? 'all 1s ease-out' : 'none'
                                }}
                                alt="floating product"
                            />
                        );
                    })}
                </div>

                <div className="hero-content" style={{ opacity: 1 - scrollProgress * 1.5, transform: `translateY(${-scrollProgress * 100}px)` }}>
                    <h1 style={{ background: 'none', color: 'var(--text)', WebkitTextFillColor: 'initial' }}>Premium Quality Products</h1>
                    <p>Discover our curated collection of high-end essentials designed for modern living.</p>
                    <a href="/store" className="btn btn-primary" onClick={(e) => { e.preventDefault(); window.location.href='/store' }}>Explore Collection</a>
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
