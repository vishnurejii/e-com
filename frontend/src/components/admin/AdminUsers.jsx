import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Shield, CheckCircle, XCircle } from 'lucide-react';

const AdminUsers = ({ user }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/users', config);
            setUsers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.token) {
            fetchUsers();
        }
    }, [user]);

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center', fontWeight: 600, color: 'var(--secondary)' }}>Retrieving customer registry...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.04em' }}>User Database</h2>
            </div>
            
            <div style={{ background: 'white', borderRadius: '24px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
                <table className="admin-table" style={{ margin: 0 }}>
                    <thead style={{ background: '#f8fafc' }}>
                        <tr>
                            <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)' }}>User Name</th>
                            <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)' }}>Email Address</th>
                            <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)' }}>Role</th>
                            <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)' }}>Status</th>
                            <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', textAlign: 'right' }}>Registered On</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1.25rem 1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: u.is_superadmin ? '#ef4444' : u.is_seller ? '#8b5cf6' : u.is_staff ? 'var(--primary)' : 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.9rem' }}>
                                            {(u.first_name || 'U')[0]}{(u.last_name || 'U')[0]}
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 700, color: 'var(--text)' }}>{u.first_name} {u.last_name}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>{u.shopName ? `Shop: ${u.shopName}` : `@${u.username || 'user'}`}</p>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem 1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        <Mail size={14} />
                                        <span>{u.email}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem 1.5rem' }}>
                                    <span style={{ 
                                        padding: '0.35rem 0.75rem', 
                                        borderRadius: '20px', 
                                        fontSize: '0.75rem', 
                                        fontWeight: 700, 
                                        background: u.is_superadmin ? '#fee2e2' : u.is_seller ? '#ede9fe' : u.is_staff ? '#e0e7ff' : '#f1f5f9',
                                        color: u.is_superadmin ? '#b91c1c' : u.is_seller ? '#6d28d9' : u.is_staff ? '#4338ca' : '#475569',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.35rem'
                                    }}>
                                        <Shield size={12} />
                                        {u.is_superadmin ? 'SUPERADMIN' : u.is_seller ? 'SELLER' : u.is_staff ? 'STAFF' : 'CUSTOMER'}
                                    </span>
                                </td>
                                <td style={{ padding: '1.25rem 1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#10b981', fontWeight: 600, fontSize: '0.85rem' }}>
                                        <CheckCircle size={16} />
                                        <span>Active</span>
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    {new Date(u.createdAt || Date.now()).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsers;
