import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
                setProduct(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchProduct();
    }, [id]);

    if (!product) return <div className="container" style={{ padding: '5rem 0' }}>Loading...</div>;

    return (
        <div className="container details-container">
            <div className="product-image-container" style={{ height: 'auto', borderRadius: '24px' }}>
               <img src={product.image || 'https://via.placeholder.com/600?text=Product+Image'} alt={product.product_name} className="details-image" />
            </div>
            <div className="details-info">
                <Link to="/store" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--secondary)', marginBottom: '2rem' }}>
                    <ArrowLeft size={20} /> Back to Store
                </Link>
                <p className="product-category">{product.category?.category_name}</p>
                <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.1 }}>{product.product_name}</h1>
                <p className="details-price" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '2rem' }}>${product.price}</p>
                <div className="details-desc" style={{ fontSize: '1.125rem', color: 'var(--text-muted)', marginBottom: '3rem', lineHeight: 1.8 }}>{product.description || "No description available for this premium product."}</div>
                <button className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }} onClick={() => addToCart(product)}>
                    <ShoppingCart size={22} />
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductDetail;
