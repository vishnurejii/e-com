import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { user } = useAuth();

    const isAdmin = user && (user.is_staff || user.is_superadmin || user.first_name === 'Admin');

    return (
        <div className="product-card">
            <Link to={`/product/${product._id}`} className="product-image-container">
                <img src={product.image || 'https://via.placeholder.com/400?text=Product+Image'} alt={product.product_name} className="product-image" />
            </Link>
            <div className="product-content">
                <p className="product-category">{product.category?.category_name || 'Category'}</p>
                <h3 className="product-title">{product.product_name}</h3>
                <div className="product-price-row">
                    <span className="product-price">${product.price}</span>
                    {!isAdmin && (
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
