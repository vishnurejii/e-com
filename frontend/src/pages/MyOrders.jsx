import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { ShoppingBag, Package, ChevronRight, Clock, CheckCircle, XCircle } from 'lucide-react';

const MyOrders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/myorders`, config);
                setOrders(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (user && user.token) {
            fetchOrders();
        }
    }, [user]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered': return <CheckCircle size={16} color="#10b981" />;
            case 'Cancelled': return <XCircle size={16} color="#ef4444" />;
            default: return <Clock size={16} color="#f59e0b" />;
        }
    };

    if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading your orders...</div>;

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
                <ShoppingBag size={40} color="var(--primary)" />
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>My Orders</h1>
            </div>

            {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '24px', border: '1px solid var(--border)' }}>
                    <Package size={64} style={{ opacity: 0.2, marginBottom: '1.5rem' }} />
                    <h3>No orders yet</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>You haven't placed any orders yet.</p>
                    <Link to="/store" className="btn btn-primary">Start Shopping</Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {orders.map(order => (
                        <Link 
                            to={`/order/${order._id}`} 
                            key={order._id} 
                            style={{ 
                                textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', 
                                background: 'white', padding: '2rem', borderRadius: '20px', border: '1px solid var(--border)', 
                                transition: 'all 0.3s ease', cursor: 'pointer' 
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            <div style={{ flexGrow: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Order #{order._id.slice(-8).toUpperCase()}</span>
                                    <span style={{ 
                                        padding: '0.35rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700,
                                        background: order.status === 'Delivered' ? '#dcfce7' : order.status === 'Cancelled' ? '#fee2e2' : '#fef9c3',
                                        color: order.status === 'Delivered' ? '#15803d' : order.status === 'Cancelled' ? '#ef4444' : '#854d0e',
                                        display: 'flex', alignItems: 'center', gap: '0.4rem'
                                    }}>
                                        {getStatusIcon(order.status)}
                                        {order.status.toUpperCase()}
                                    </span>
                                </div>
                                <p style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>
                                    Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.orderItems.length} Items
                                </p>
                            </div>
                            <div style={{ textAlign: 'right', marginRight: '2rem' }}>
                                <p style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary)' }}>${order.totalPrice.toFixed(2)}</p>
                                <p style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>PAID</p>
                            </div>
                            <ChevronRight size={20} color="var(--border)" />
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
