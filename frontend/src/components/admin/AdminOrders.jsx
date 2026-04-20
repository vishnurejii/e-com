import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, CheckCircle, Clock, ExternalLink, CreditCard } from 'lucide-react';

const AdminOrders = ({ user }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`, config);
            setOrders(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.token) {
            fetchOrders();
        }
    }, [user]);

    const statusUpdateHandler = async (id, status) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/${id}/status`, { status }, config);
            fetchOrders();
        } catch (error) {
            console.error(error);
            alert('Error updating status');
        }
    };

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center', fontWeight: 600, color: 'var(--secondary)' }}>Accessing secure transaction records...</div>;

    const statusOptions = ['Ordered', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.04em' }}>Store Orders & Payments</h2>
            </div>
            
            <div style={{ background: 'white', borderRadius: '24px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
                <table className="admin-table" style={{ margin: 0 }}>
                    <thead style={{ background: '#f8fafc' }}>
                        <tr>
                            <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)' }}>Order ID & Date</th>
                            <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)' }}>Customer Details</th>
                            <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)' }}>Transaction Amount</th>
                            <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)' }}>Payment Method</th>
                            <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)' }}>Shipping Status</th>
                            <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>No orders have been placed yet.</td>
                            </tr>
                        ) : (
                            orders.map(o => (
                                <tr key={o._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <p style={{ fontWeight: 800, color: 'var(--text)', marginBottom: '0.1rem' }}>#{o._id.slice(-8).toUpperCase()}</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>{new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <p style={{ fontWeight: 700, color: 'var(--text)' }}>{o.user?.first_name} {o.user?.last_name}</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>{o.user?.email}</p>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <p style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.125rem' }}>${o.totalPrice?.toFixed(2)}</p>
                                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#10b981', background: '#dcfce7', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>PAID</span>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            <CreditCard size={14} />
                                            <span>{o.paymentMethod || 'Credit Card'}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <span style={{ 
                                            padding: '0.4rem 0.875rem', 
                                            borderRadius: '20px', 
                                            fontSize: '0.75rem', 
                                            fontWeight: 700, 
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.35rem',
                                            background: o.status === 'Delivered' ? '#dcfce7' : o.status === 'Cancelled' ? '#fee2e2' : '#fef9c3',
                                            color: o.status === 'Delivered' ? '#15803d' : o.status === 'Cancelled' ? '#ef4444' : '#854d0e',
                                            border: `1px solid ${o.status === 'Delivered' ? '#bcf0da' : '#fde68a'}`
                                        }}>
                                            {o.status === 'Delivered' ? <CheckCircle size={14} /> : <Clock size={14} />}
                                            {o.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                        <select 
                                            value={o.status} 
                                            onChange={(e) => statusUpdateHandler(o._id, e.target.value)}
                                            style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.8rem', fontWeight: 600, outline: 'none', cursor: 'pointer' }}
                                        >
                                            {statusOptions.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrders;
