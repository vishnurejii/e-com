import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, ArrowLeft, Star, Heart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const ProductDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [reviewLoading, setReviewLoading] = useState(false);
    const [selectedSize, setSelectedSize] = useState('');
    const [fit, setFit] = useState('True to size');
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const fetchProduct = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
            setProduct(data);
            if (data.sizes && data.sizes.length > 0) {
                setSelectedSize(data.sizes[0]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const isWishlisted = isInWishlist(id);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!user) return alert('Please login to leave a review');
        setReviewLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`http://localhost:5000/api/products/${id}/reviews`, { rating, comment, fit }, config);
            alert('Review submitted!');
            setRating(0);
            setComment('');
            setFit('True to size');
            fetchProduct();
        } catch (error) {
            alert(error.response?.data?.message || 'Error submitting review');
        } finally {
            setReviewLoading(false);
        }
    };

    const isAdmin = user && (user.is_staff || user.is_superadmin || user.first_name === 'Admin');
    if (!product) return <div className="container" style={{ padding: '5rem 0' }}>Loading...</div>;
    
    const isSeller = user && user.is_seller;
    const isProductOwner = user && product.seller && user._id === (product.seller._id || product.seller);

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
                        <div>
                            <p className="product-category">{product.category?.category_name}</p>
                            {product.seller && (
                                <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700, marginTop: '0.25rem' }}>
                                    Sold by: <span style={{ textDecoration: 'underline' }}>{product.seller.shopName || 'Marketplace Seller'}</span>
                                </p>
                            )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontWeight: 800 }}>
                            <Star size={18} fill="#f59e0b" /> {product.rating.toFixed(1)} ({product.numReviews} reviews)
                        </div>
                    </div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.1 }}>{product.product_name}</h1>
                    <p className="details-price" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '2rem' }}>${product.price.toFixed(2)}</p>
                    <div className="details-desc" style={{ fontSize: '1.125rem', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.8 }}>{product.description || "No description available for this premium product."}</div>
                    
                    {/* Stock Status */}
                    <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: product.stock > 0 ? '#10b981' : '#ef4444' }}></div>
                        <span style={{ fontWeight: 700, color: product.stock > 0 ? '#10b981' : '#ef4444', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
                        </span>
                    </div>

                    {/* Size Selection */}
                    {product.sizes && product.sizes.length > 0 && (
                        <div style={{ marginBottom: '3rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <label style={{ fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Select Size</label>
                                <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>Size Guide</button>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                {product.sizes.map(sz => (
                                    <button 
                                        key={sz}
                                        onClick={() => setSelectedSize(sz)}
                                        style={{
                                            minWidth: '60px',
                                            height: '50px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '12px',
                                            border: `2px solid ${selectedSize === sz ? 'var(--primary)' : 'var(--border)'}`,
                                            background: selectedSize === sz ? 'var(--primary--light)' : 'white',
                                            color: selectedSize === sz ? 'var(--primary)' : 'var(--text)',
                                            fontWeight: 800,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        {sz}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {!isAdmin && !isSeller && (
                            <button 
                                className="btn btn-primary" 
                                style={{ padding: '1.25rem 2.5rem', fontSize: '1.125rem', flexGrow: 1, opacity: product.stock === 0 ? 0.5 : 1 }} 
                                onClick={() => addToCart(product, selectedSize)}
                                disabled={product.stock === 0}
                            >
                                <ShoppingCart size={22} /> {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </button>
                        )}
                        {user && (
                            <button 
                                className="btn" 
                                style={{ padding: '1.25rem', background: 'white', border: '1px solid var(--border)', color: '#ef4444' }} 
                                onClick={() => toggleWishlist(product._id)}
                            >
                                <Heart size={24} fill={isWishlisted ? "#ef4444" : "none"} color={isWishlisted ? "#ef4444" : "currentColor"} />
                            </button>
                        )}
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
                                    {review.fit && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '8px', alignSelf: 'flex-start', width: 'fit-content' }}>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Fit:</span>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--secondary)' }}>{review.fit}</span>
                                        </div>
                                    )}
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1rem' }}>{new Date(review.createdAt).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Write a Review</h2>
                    {!isAdmin ? (
                        user ? (
                            isProductOwner ? (
                                <div style={{ background: '#f8fafc', padding: '2.5rem', borderRadius: '24px', textAlign: 'center', border: '1px solid var(--border)' }}>
                                    <p style={{ color: 'var(--text-muted)' }}>You cannot review your own product.</p>
                                </div>
                            ) : (
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
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.75rem' }}>Your Experience</label>
                                        <textarea 
                                            value={comment} 
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Tell others about this product..."
                                            style={{ width: '100%', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border)', minHeight: '150px', fontSize: '1rem', outline: 'none' }}
                                            required
                                        />
                                    </div>
                                    <div style={{ marginBottom: '2rem' }}>
                                        <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.75rem' }}>Product Fit</label>
                                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                            {['Small', 'True to size', 'Large'].map(option => (
                                                <button 
                                                    key={option}
                                                    type="button"
                                                    onClick={() => setFit(option)}
                                                    style={{
                                                        padding: '0.75rem 1.25rem',
                                                        borderRadius: '12px',
                                                        border: `1.5px solid ${fit === option ? 'var(--primary)' : 'var(--border)'}`,
                                                        background: fit === option ? 'var(--primary--light)' : 'white',
                                                        color: fit === option ? 'var(--primary)' : 'var(--text-muted)',
                                                        fontWeight: 700,
                                                        fontSize: '0.9rem',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-primary" disabled={reviewLoading} style={{ width: '100%', padding: '1.25rem' }}>
                                        {reviewLoading ? 'Submitting...' : 'Post Review'}
                                    </button>
                                </form>
                            )
                        ) : (
                            <div style={{ background: '#f8fafc', padding: '2.5rem', borderRadius: '24px', textAlign: 'center', border: '1px dashed var(--border)' }}>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You must be logged in to leave a review.</p>
                                <Link to="/login" className="btn btn-primary">Login to Review</Link>
                            </div>
                        )
                    ) : (
                        <div style={{ background: '#f8fafc', padding: '2.5rem', borderRadius: '24px', textAlign: 'center', border: '1px solid var(--border)' }}>
                            <p style={{ color: 'var(--text-muted)' }}>Administrators cannot post reviews.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
