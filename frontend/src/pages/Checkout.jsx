import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { CreditCard, Truck, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Checkout = () => {
    const { cart, cartTotal } = useCart();
    const { user } = useAuth();
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        
        const orderData = {
            orderItems: cart.items.map(item => ({
                name: item.product.product_name,
                qty: item.quantity,
                image: item.product.image,
                price: item.product.price,
                product: item.product._id,
                size: item.size
            })),
            shippingAddress: { address, city, postalCode, country },
            paymentMethod: 'Credit Card',
            totalPrice: cartTotal
        };

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                }
            };
            await axios.post('http://localhost:5000/api/orders', orderData, config);
            setIsSuccess(true);
        } catch (error) {
            console.error(error);
            alert('Failed to place order. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '10rem 0' }}>
                <CheckCircle size={80} color="#10b981" style={{ marginBottom: '2rem' }} />
                <h1 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.05em' }}>Order Successful!</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', marginTop: '1rem', maxWidth: '600px', margin: '1rem auto' }}>Thank you for your purchase. Your payment was processed successfully and your order is on its way.</p>
                <Link to="/" className="btn btn-primary" style={{ marginTop: '2rem', padding: '1rem 2rem' }}>Return to Home</Link>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '5rem 0' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '3rem', letterSpacing: '-0.05em' }}>Checkout</h1>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 450px', gap: '4rem', alignItems: 'start' }}>
                <div style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', letterSpacing: '-0.025em' }}>
                        <Truck size={24} color="var(--primary)" /> Shipping Information
                    </h2>
                    <div className="form-group">
                        <label>Shipping Address</label>
                        <input type="text" className="form-control" placeholder="123 Main St" value={address} onChange={(e) => setAddress(e.target.value)} required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label>City</label>
                            <input type="text" className="form-control" placeholder="New York" value={city} onChange={(e) => setCity(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Postal Code</label>
                            <input type="text" className="form-control" placeholder="10001" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Country</label>
                        <input type="text" className="form-control" placeholder="United States" value={country} onChange={(e) => setCountry(e.target.value)} required />
                    </div>

                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '3rem 0 2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', letterSpacing: '-0.025em' }}>
                        <CreditCard size={24} color="var(--primary)" /> Payment Method
                    </h2>
                    <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Credit Card Details</span>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <div style={{ width: '35px', height: '22px', background: '#e2e8f0', borderRadius: '4px' }}></div>
                                <div style={{ width: '35px', height: '22px', background: '#e2e8f0', borderRadius: '4px' }}></div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Card Number</label>
                            <input type="text" className="form-control" style={{ letterSpacing: '0.1em' }} value="4242 4242 4242 4242" disabled />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="form-group">
                                <label>Expiry Date</label>
                                <input type="text" className="form-control" value="12/25" disabled />
                            </div>
                            <div className="form-group">
                                <label>CVC</label>
                                <input type="text" className="form-control" value="•••" disabled />
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)', position: 'sticky', top: '120px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', letterSpacing: '-0.025em' }}>Order Summary</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                        {cart.items.map(item => (
                            <div key={item.product._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>{item.product.product_name} x {item.quantity}</span>
                                <span style={{ fontWeight: 600 }}>${(item.product.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <hr style={{ border: 'none', borderTop: '1px solid var(--border)', marginBottom: '1.5rem' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                        <span>Subtotal</span>
                        <span style={{ color: 'var(--text)', fontWeight: 600 }}>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', fontSize: '1.5rem', fontWeight: 800 }}>
                        <span>Total Price</span>
                        <span style={{ color: 'var(--primary)' }}>${cartTotal.toFixed(2)}</span>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1.125rem' }} disabled={isProcessing}>
                        {isProcessing ? 'Processing Payment...' : 'Securely Pay Now'}
                    </button>
                    <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
                        🛡️ Your payment is secured with industry-standard encryption.
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Checkout;
