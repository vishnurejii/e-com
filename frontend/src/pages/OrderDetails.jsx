import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, Package, Truck, MapPin, CreditCard, CheckCircle2, Circle, AlertCircle } from 'lucide-react';

const OrderDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchOrder = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`http://localhost:5000/api/orders/${id}`, config);
            setOrder(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.token) {
            fetchOrder();
        }
    }, [id, user]);

    const cancelOrderHandler = async () => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            try {
                setActionLoading(true);
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.put(`http://localhost:5000/api/orders/${id}/cancel`, {}, config);
                fetchOrder();
            } catch (error) {
                alert(error.response?.data?.message || 'Error cancelling order');
            } finally {
                setActionLoading(false);
            }
        }
    };

    if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading order details...</div>;
    if (!order) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Order not found.</div>;

    const statuses = ['Ordered', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
    const currentStatusIndex = statuses.indexOf(order.status);
    const isCancelled = order.status === 'Cancelled';

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <Link to="/myorders" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--secondary)', marginBottom: '2rem', fontWeight: 600 }}>
                <ChevronLeft size={20} /> Back to My Orders
            </Link>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Order Details</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Order ID: #{order._id} • Placed on {new Date(order.createdAt).toLocaleString()}</p>
                </div>
                { (order.status === 'Ordered' || order.status === 'Processing') && !isCancelled && (
                    <button 
                        onClick={cancelOrderHandler} 
                        disabled={actionLoading}
                        className="btn" 
                        style={{ background: '#fee2e2', color: '#ef4444', border: '1px solid #fecaca' }}
                    >
                        {actionLoading ? 'Cancelling...' : 'Cancel Order'}
                    </button>
                )}
            </div>

            {/* Tracking Progress Bar */}
            {!isCancelled ? (
                <div style={{ background: 'white', padding: '3rem', borderRadius: '24px', border: '1px solid var(--border)', marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '1rem' }}>
                        {/* Connecting Line */}
                        <div style={{ position: 'absolute', top: '15px', left: '5%', right: '5%', height: '4px', background: '#f1f5f9', zIndex: 1 }}></div>
                        <div style={{ position: 'absolute', top: '15px', left: '5%', width: `${(currentStatusIndex / (statuses.length - 1)) * 90}%`, height: '4px', background: 'var(--primary)', zIndex: 2, transition: 'width 1s ease' }}></div>

                        {statuses.map((status, index) => (
                            <div key={status} style={{ zIndex: 3, textAlign: 'center', flex: 1 }}>
                                <div style={{ 
                                    width: '32px', height: '32px', borderRadius: '50%', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: index <= currentStatusIndex ? 'var(--primary)' : 'white',
                                    color: index <= currentStatusIndex ? 'white' : '#cbd5e1',
                                    border: index <= currentStatusIndex ? 'none' : '4px solid #f1f5f9',
                                    boxShadow: index === currentStatusIndex ? '0 0 0 4px rgba(37, 99, 235, 0.2)' : 'none'
                                }}>
                                    {index <= currentStatusIndex ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                                </div>
                                <p style={{ fontSize: '0.75rem', fontWeight: 800, color: index <= currentStatusIndex ? 'var(--text)' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    {status}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div style={{ background: '#fef2f2', padding: '2rem', borderRadius: '24px', border: '1px solid #fee2e2', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem', color: '#ef4444' }}>
                    <AlertCircle size={24} />
                    <div>
                        <h4 style={{ fontWeight: 800 }}>Order Cancelled</h4>
                        <p style={{ fontSize: '0.9rem' }}>This order was cancelled and a refund (if applicable) has been initiated.</p>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Items Section */}
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border)' }}>
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Package size={24} color="var(--primary)" /> Order Items</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {order.orderItems.map(item => (
                                <div key={item.product} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                    <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px' }} />
                                    <div style={{ flexGrow: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <Link to={`/product/${item.product}`} style={{ textDecoration: 'none', color: 'var(--text)', fontWeight: 700 }}>{item.name}</Link>
                                            <span style={{ 
                                                fontSize: '0.7rem', 
                                                fontWeight: 800, 
                                                background: item.itemStatus === 'Delivered' ? '#dcfce7' : item.itemStatus === 'Cancelled' ? '#fee2e2' : '#f1f5f9',
                                                color: item.itemStatus === 'Delivered' ? '#15803d' : item.itemStatus === 'Cancelled' ? '#ef4444' : '#64748b',
                                                padding: '0.25rem 0.6rem',
                                                borderRadius: '6px',
                                                textTransform: 'uppercase'
                                            }}>
                                                {item.itemStatus}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>{item.qty} x ${item.price.toFixed(2)}</p>
                                            {item.size && (
                                                <span style={{ fontSize: '0.8rem', fontWeight: 800, background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                                                    SIZE: {item.size}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <p style={{ fontWeight: 800 }}>${(item.qty * item.price).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        <div style={{ borderTop: '1px solid var(--border)', marginTop: '2rem', paddingTop: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--secondary)' }}>Subtotal</span>
                                <span>${order.totalPrice.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span style={{ color: 'var(--secondary)' }}>Tax</span>
                                <span>$0.00</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 800 }}>
                                <span>Total</span>
                                <span style={{ color: 'var(--primary)' }}>${order.totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Shipping Address */}
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border)' }}>
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><MapPin size={24} color="var(--primary)" /> Shipping Address</h3>
                        <p style={{ fontWeight: 700 }}>{user.first_name} {user.last_name}</p>
                        <p style={{ color: 'var(--secondary)', fontSize: '0.9rem' }}>{order.shippingAddress.address}</p>
                        <p style={{ color: 'var(--secondary)', fontSize: '0.9rem' }}>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                        <p style={{ color: 'var(--secondary)', fontSize: '0.9rem' }}>{order.shippingAddress.country}</p>
                    </div>

                    {/* Payment Info */}
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border)' }}>
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><CreditCard size={24} color="var(--primary)" /> Payment Information</h3>
                        <p style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{order.paymentMethod}</p>
                        <div style={{ padding: '0.5rem 1rem', background: '#dcfce7', color: '#15803d', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, display: 'inline-block' }}>
                            PAID AT {new Date(order.paidAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
