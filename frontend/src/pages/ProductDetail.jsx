import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, ArrowLeft, Star, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [reviewLoading, setReviewLoading] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const { addToCart } = useCart();

    const fetchProduct = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
            setProduct(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const addToWishlistHandler = async () => {
        if (!user) return alert('Please login to add to wishlist');
        try {
            setWishlistLoading(true);
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('http://localhost:5000/api/wishlist', { productId: product._id }, config);
            alert('Added to wishlist!');
        } catch (error) {
            console.error(error);
            alert('Error adding to wishlist');
        } finally {
            setWishlistLoading(false);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!user) return alert('Please login to leave a review');
        setReviewLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`http://localhost:5000/api/products/${id}/reviews`, { rating, comment }, config);
            alert('Review submitted!');
            setRating(0);
            setComment('');
            fetchProduct();
        } catch (error) {
            alert(error.response?.data?.message || 'Error submitting review');
        } finally {
            setReviewLoading(false);
        }
    };

    if (!product) return <div className="container" style={{ padding: '5rem 0' }}>Loading...</div>;

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <div className="details-container">
                <div className="product-image-container" style={{ height: 'auto', borderRadius: '24px', background: 'white', padding: '1rem', border: '1px solid var(--border)' }}>
                    <img src={product.image || 'https://via.placeholder.com/600?text=Product+Image'} alt={product.product_name} className="details-image" style={{ borderRadius: '16px' }} />
                </div>
                <div className="details-info">
                    <Link to="/store" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--secondary)', marginBottom: '2rem' }}>
                        <ArrowLeft size={20} /> Back to Store
                    </Link>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <p className="product-category">{product.category?.category_name}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontWeight: 800 }}>
                            <Star size={18} fill="#f59e0b" /> {product.rating.toFixed(1)} ({product.numReviews} reviews)
                        </div>
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.1 }}>{product.product_name}</h1>
                    <p className="details-price" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '2rem' }}>${product.price.toFixed(2)}</p>
                    <div className="details-desc" style={{ fontSize: '1.125rem', color: 'var(--text-muted)', marginBottom: '3rem', lineHeight: 1.8 }}>{product.description || "No description available for this premium product."}</div>
                    
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-primary" style={{ padding: '1.25rem 2.5rem', fontSize: '1.125rem', flexGrow: 1 }} onClick={() => addToCart(product)}>
                            <ShoppingCart size={22} /> Add to Cart
                        </button>
                        <button 
                            className="btn" 
                            style={{ padding: '1.25rem', background: 'white', border: '1px solid var(--border)', color: '#ef4444' }} 
                            onClick={addToWishlistHandler}
                            disabled={wishlistLoading}
                        >
                            <Heart size={24} fill={wishlistLoading ? "#fee2e2" : "none"} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div style={{ marginTop: '5rem', display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4rem' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Customer Reviews</h2>
                    {product.reviews.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first to share your thoughts!</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {product.reviews.map(review => (
                                <div key={review._id} style={{ background: 'white', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                        <p style={{ fontWeight: 800 }}>{review.name}</p>
                                        <div style={{ display: 'flex', gap: '2px' }}>
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} fill={i < review.rating ? "#f59e0b" : "none"} color="#f59e0b" />
                                            ))}
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--secondary)', lineHeight: 1.6 }}>{review.comment}</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>{new Date(review.createdAt).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Write a Review</h2>
                    {user ? (
                        <form onSubmit={submitHandler} style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--border)' }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.75rem' }}>Rating</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {[1, 2, 3, 4, 5].map(nu => (
                                        <button 
                                            key={nu} 
                                            type="button" 
                                            onClick={() => setRating(nu)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                        >
                                            <Star size={32} fill={rating >= nu ? "#f59e0b" : "none"} color="#f59e0b" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.75rem' }}>Your Experience</label>
                                <textarea 
                                    value={comment} 
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Tell others about this product..."
                                    style={{ width: '100%', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border)', minHeight: '150px', fontSize: '1rem', outline: 'none' }}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={reviewLoading} style={{ width: '100%', padding: '1.25rem' }}>
                                {reviewLoading ? 'Submitting...' : 'Post Review'}
                            </button>
                        </form>
                    ) : (
                        <div style={{ background: '#f8fafc', padding: '2.5rem', borderRadius: '24px', textAlign: 'center', border: '1px dashed var(--border)' }}>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You must be logged in to leave a review.</p>
                            <Link to="/login" className="btn btn-primary">Login to Review</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
