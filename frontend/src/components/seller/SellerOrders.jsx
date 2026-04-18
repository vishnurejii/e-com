import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Package, Truck, CheckCircle, Clock, Eye, Sliders } from 'lucide-react';

const SellerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const { user } = useAuth();
    const [filter, setFilter] = useState('All');

    if (!user) return null;

    const fetchOrders = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/orders/seller', config);
            setOrders(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatusHandler = async (orderId, productId, status) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put('http://localhost:5000/api/orders/item-status', { orderId, productId, status }, config);
            fetchOrders();
        } catch (error) {
            console.error(error);
            alert('Failed to update status');
        }
    };

    if (loading) return <div>Checking secure transaction records...</div>;

    const statusOptions = ['Ordered', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Manage Fulfillments</h2>
                <div style={{ display: 'flex', gap: '0.5rem', background: '#f1f5f9', padding: '0.4rem', borderRadius: '14px' }}>
                    {['All', 'Processing', 'Shipped'].map(f => (
                        <button 
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{ 
                                padding: '0.5rem 1rem', 
                                border: 'none', 
                                background: filter === f ? 'white' : 'transparent',
                                borderRadius: '10px',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                boxShadow: filter === f ? 'var(--shadow-sm)' : 'none'
                            }}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {orders.length === 0 ? (
                    <div style={{ background: 'white', padding: '5rem', textAlign: 'center', borderRadius: '32px', border: '1px dashed var(--border)' }}>
                        <p style={{ color: 'var(--text-muted)' }}>No sales recorded yet. Your products are waiting for their first buyer!</p>
                    </div>
                ) : (
                    orders.map(order => {
                        // Filter items to show only those belonging to this seller
                        const myItems = order.orderItems.filter(item => item.seller.toString() === user._id.toString());
                        
                        return (
                            <div key={order._id} style={{ background: 'white', borderRadius: '24px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                                <div style={{ background: '#f8fafc', padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
                                    <div>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Order Information</p>
                                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                            <span style={{ fontWeight: 800 }}>#{order._id.slice(-8).toUpperCase()}</span>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Customer: <b style={{ color: 'var(--text)' }}>{order.user?.first_name} {order.user?.last_name}</b></span>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Placed: <b style={{ color: 'var(--text)' }}>{new Date(order.createdAt).toLocaleDateString()}</b></span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Delivery To</p>
                                        <p style={{ fontSize: '0.9rem' }}>{order.shippingAddress?.city}, {order.shippingAddress?.country}</p>
                                    </div>
                                </div>
                                <div style={{ padding: '0' }}>
                                    {myItems.map(item => (
                                        <div key={item.product} style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                                <img src={item.image} alt="" style={{ width: '64px', height: '64px', borderRadius: '16px', objectFit: 'cover' }} />
                                                <div>
                                                    <p style={{ fontWeight: 800, fontSize: '1.125rem' }}>{item.name}</p>
                                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Quantity: {item.qty} | Price: ${item.price.toFixed(2)}</p>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                                <div style={{ textAlign: 'right' }}>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.5rem' }}>Fulfillment Status</p>
                                                    <select 
                                                        value={item.itemStatus} 
                                                        onChange={(e) => updateStatusHandler(order._id, item.product, e.target.value)}
                                                        style={{ 
                                                            padding: '0.6rem 1rem', 
                                                            borderRadius: '12px', 
                                                            border: '1px solid var(--border)', 
                                                            fontSize: '0.875rem', 
                                                            fontWeight: 700,
                                                            outline: 'none',
                                                            cursor: 'pointer',
                                                            background: item.itemStatus === 'Delivered' ? '#dcfce7' : item.itemStatus === 'Cancelled' ? '#fee2e2' : 'white',
                                                            color: item.itemStatus === 'Delivered' ? '#15803d' : item.itemStatus === 'Cancelled' ? '#ef4444' : 'inherit'
                                                        }}
                                                    >
                                                        {statusOptions.map(opt => (
                                                            <option key={opt} value={opt}>{opt}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default SellerOrders;
