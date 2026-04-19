import React from 'react';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

    if (cart.items.length === 0) {
        return (
            <div className="container" style={{ padding: '8rem 0', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.05em' }}>Your Cart is Empty</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', marginBottom: '2.5rem', maxWidth: '500px', margin: '0 auto 2.5rem' }}>Looks like you haven't added anything to your cart yet. Explore our premium collection and find something you love.</p>
                <Link to="/store" className="btn btn-primary" style={{ padding: '1rem 2.5rem' }}>Go to Store</Link>
            </div>
        );
    }

    return (
        <div className="container cart-container">
            <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '3rem', letterSpacing: '-0.05em' }}>Shopping Cart</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '3rem', alignItems: 'start' }}>
                <div className="cart-items">
                    {cart.items.map(item => (
                        <div key={`${item.product._id}-${item.size}`} className="cart-item" style={{ boxShadow: 'var(--shadow)' }}>
                            <img src={item.product.image || 'https://via.placeholder.com/150?text=Product'} alt={item.product.product_name} className="cart-item-img" />
                            <div className="cart-item-info">
                                <h3 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.25rem' }}>{item.product.product_name}</h3>
                                {item.size && (
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 700 }}>
                                        Size: <span style={{ color: 'var(--primary)' }}>{item.size}</span>
                                    </p>
                                )}
                                <p style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.125rem' }}>${item.product.price}</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginRight: '2rem', background: '#f1f5f9', padding: '0.5rem', borderRadius: '12px' }}>
                                <button onClick={() => updateQuantity(item.product._id, item.size, item.quantity - 1)} className="btn btn-sm" style={{ padding: '0.25rem', background: 'white', borderRadius: '8px', border: '1px solid var(--border)' }}><Minus size={14} /></button>
                                <span style={{ fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.product._id, item.size, item.quantity + 1)} className="btn btn-sm" style={{ padding: '0.25rem', background: 'white', borderRadius: '8px', border: '1px solid var(--border)' }}><Plus size={14} /></button>
                            </div>
                            <button onClick={() => removeFromCart(item.product._id, item.size)} style={{ color: '#ef4444', border: 'none', background: '#fee2e2', padding: '0.75rem', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }} aria-label="Remove item">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="cart-summary" style={{ boxShadow: 'var(--shadow-lg)' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.025em' }}>Order Summary</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                        <span>Subtotal</span>
                        <span style={{ color: 'var(--text)', fontWeight: 600 }}>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                        <span>Shipping</span>
                        <span style={{ color: '#10b981', fontWeight: 700 }}>FREE</span>
                    </div>
                    <hr style={{ border: 'none', borderTop: '1px solid var(--border)', marginBottom: '1.5rem' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', fontSize: '1.5rem', fontWeight: 800 }}>
                        <span>Total</span>
                        <span style={{ color: 'var(--primary)' }}>${cartTotal.toFixed(2)}</span>
                    </div>
                    <Link to="/checkout" className="btn btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1.125rem' }}>
                        Begin Checkout <ArrowRight size={20} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Cart;
