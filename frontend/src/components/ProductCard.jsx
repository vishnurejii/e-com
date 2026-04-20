import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { user } = useAuth();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const isRestricted = user && (user.is_staff || user.is_superadmin || user.is_seller || user.first_name === 'Admin');
    const isWishlisted = isInWishlist(product._id);

    return (
        <div className="product-card" style={{ position: 'relative' }}>
            {user && (
                <button 
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product._id);
                    }}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 10,
                        boxShadow: 'var(--shadow)',
                        transition: 'all 0.3s ease'
                    }}
                    title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                    <Heart size={20} color={isWishlisted ? "#ef4444" : "#475569"} fill={isWishlisted ? "#ef4444" : "none"} />
                </button>
            )}
            <Link to={`/product/${product._id}`} className="product-image-container">
                <img src={product.image || 'https://via.placeholder.com/400?text=Product+Image'} alt={product.product_name} className="product-image" />
            </Link>
            <div className="product-content">
                <p className="product-category">{product.category?.category_name || 'Category'}</p>
                <h3 className="product-title">{product.product_name}</h3>
                <div className="product-price-row">
                    <span className="product-price">${product.price}</span>
                    {!isRestricted && (
                        <button className="btn btn-primary btn-sm" onClick={() => addToCart(product)}>
                            <ShoppingCart size={18} />
                            Add
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
