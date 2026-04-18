import React, { useState } from 'react';
import axios from 'axios';
import SellerProducts from '../components/seller/SellerProducts';
import SellerOrders from '../components/seller/SellerOrders';
import { ShoppingBag, DollarSign, Package, Settings, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SellerDashboard = () => {
    const [activeTab, setActiveTab] = useState('products');
    const { user } = useAuth();

    if (!user) {
        return <div className="container" style={{ padding: '8rem 0', textAlign: 'center' }}>Please sign in to access the seller dashboard.</div>;
    }

    const tabs = [
        { id: 'products', label: 'My Products', icon: <ShoppingBag size={20} /> },
        { id: 'orders', label: 'My Sales', icon: <DollarSign size={20} /> },
        { id: 'settings', label: 'Shop Settings', icon: <Settings size={20} /> }
    ];

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <div style={{ marginBottom: '4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.05em' }}>{user.shopName || 'Seller'} Dashboard</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', marginTop: '0.5rem' }}>Welcome back to your business control center.</p>
                    </div>
                    <div style={{ background: 'white', padding: '1rem 2rem', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', textAlign: 'right' }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Shop Status</p>
                        <p style={{ color: '#10b981', fontWeight: 800, fontSize: '1.25rem' }}>● Online & Active</p>
                    </div>
                </div>

                {/* Dashboard Tabs */}
                <div style={{ display: 'flex', gap: '1rem', background: '#f1f5f9', padding: '0.5rem', borderRadius: '24px', width: 'fit-content' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '1rem 1.5rem',
                                borderRadius: '20px',
                                border: 'none',
                                background: activeTab === tab.id ? 'white' : 'transparent',
                                color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: activeTab === tab.id ? 'var(--shadow)' : 'none'
                            }}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
                {activeTab === 'products' && <SellerProducts />}
                {activeTab === 'orders' && <SellerOrders />}
                {activeTab === 'settings' && <ShopSettings />}
            </div>
        </div>
    );
};

const ShopSettings = () => {
    const { user, login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        shopName: user.shopName || '',
        shopDescription: user.shopDescription || ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.put('http://localhost:5000/api/users/profile', formData, config);
            login(data);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: 'white', padding: '3rem', borderRadius: '32px', border: '1px solid var(--border)', maxWidth: '800px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Shop Profile Settings</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div className="form-group">
                        <label>First Name</label>
                        <input type="text" name="first_name" className="form-control" value={formData.first_name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input type="text" name="last_name" className="form-control" value={formData.last_name} onChange={handleChange} required />
                    </div>
                </div>
                <div className="form-group">
                    <label>Shop Name</label>
                    <input type="text" name="shopName" className="form-control" value={formData.shopName} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Shop Description</label>
                    <textarea name="shopDescription" className="form-control" value={formData.shopDescription} onChange={handleChange} style={{ minHeight: '120px' }} />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '1.25rem' }}>
                    {loading ? 'Saving Changes...' : 'Update Shop Profile'}
                </button>
            </form>
        </div>
    );
};

export default SellerDashboard;
