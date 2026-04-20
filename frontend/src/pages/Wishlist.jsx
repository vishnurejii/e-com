import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';

const Wishlist = () => {
    const { user } = useAuth();
    const { addToCart } = useCart();
    const { wishlist, loading, removeFromWishlist } = useWishlist();

    const handleAddToCart = (product) => {
        addToCart(product);
    };

    if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading wishlist...</div>;

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
                <Heart size={40} color="#ef4444" fill="#ef4444" />
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>My Wishlist</h1>
            </div>

            {wishlist.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '32px', border: '1px solid var(--border)' }}>
                    <Heart size={64} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Your wishlist is empty</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Save items you love to find them easily later.</p>
                    <Link to="/store" className="btn btn-primary">Discover Products</Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {wishlist.map(product => (
                        <div key={product._id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
                            <button 
                                onClick={() => removeFromWishlist(product._id)}
                                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow)', zIndex: 10 }}
                            >
                                <Trash2 size={18} color="#ef4444" />
                            </button>
                            <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div style={{ height: '300px', overflow: 'hidden', borderRadius: '16px', marginBottom: '1rem' }}>
                                    <img src={product.image} alt={product.product_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>{product.product_name}</h3>
                                <p style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '1.5rem' }}>${product.price.toFixed(2)}</p>
                            </Link>
                            <div style={{ marginTop: 'auto', display: 'flex', gap: '1rem' }}>
                                <button className="btn btn-primary" style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} onClick={() => handleAddToCart(product)}>
                                    <ShoppingCart size={18} /> Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
