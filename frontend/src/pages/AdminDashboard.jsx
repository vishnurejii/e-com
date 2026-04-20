import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Package, ShoppingBag, Users, AlertCircle, LogOut, ChevronRight } from 'lucide-react';
import AdminProducts from '../components/admin/AdminProducts';
import AdminOrders from '../components/admin/AdminOrders';
import AdminUsers from '../components/admin/AdminUsers';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const refreshData = async () => {
        try {
            const resProds = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`);
            const resCats = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories`);
            setProducts(resProds.data);
            setCategories(resCats.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && (user.is_staff || user.is_superadmin || user.first_name === 'Admin')) {
            refreshData();
        }
    }, [user]);

    if (!user || (!user.is_staff && !user.is_superadmin && user.first_name !== 'Admin')) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '10rem 0' }}>
                <div style={{ background: 'white', padding: '4rem', borderRadius: '32px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)', maxWidth: '500px', margin: '0 auto' }}>
                    <AlertCircle size={64} color="#ef4444" style={{ marginBottom: '2rem' }} />
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.05em' }}>Access Restricted</h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '1rem', fontSize: '1.125rem' }}>This terminal is reserved for authorized store administrators only.</p>
                    <a href="/" className="btn btn-primary" style={{ marginTop: '2.5rem', padding: '1rem 2rem' }}>Return to Storefront</a>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 84px)', background: '#f8fafc' }}>
            {/* Sidebar */}
            <aside style={{ width: '320px', background: 'white', borderRight: '1px solid var(--border)', padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', position: 'sticky', top: '84px', height: 'calc(100vh - 84px)' }}>
                <div style={{ marginBottom: '3.5rem', padding: '0 1rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>Management Console</p>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.025em' }}>Control Center</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flexGrow: 1 }}>
                    <button 
                        onClick={() => setActiveTab('products')}
                        style={{ 
                            display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.125rem 1.25rem', borderRadius: '16px', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 700,
                            background: activeTab === 'products' ? 'var(--primary)' : 'transparent',
                            color: activeTab === 'products' ? 'white' : 'var(--text-muted)',
                            transition: 'all 0.2s',
                            boxShadow: activeTab === 'products' ? '0 10px 15px -3px rgba(37, 99, 235, 0.25)' : 'none'
                        }}
                    >
                        <Package size={22} /> 
                        <span style={{ flexGrow: 1, textAlign: 'left' }}>Product Inventory</span>
                        {activeTab === 'products' && <ChevronRight size={18} />}
                    </button>
                    <button 
                        onClick={() => setActiveTab('orders')}
                        style={{ 
                            display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.125rem 1.25rem', borderRadius: '16px', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 700,
                            background: activeTab === 'orders' ? 'var(--primary)' : 'transparent',
                            color: activeTab === 'orders' ? 'white' : 'var(--text-muted)',
                            transition: 'all 0.2s',
                            boxShadow: activeTab === 'orders' ? '0 10px 15px -3px rgba(37, 99, 235, 0.25)' : 'none'
                        }}
                    >
                        <ShoppingBag size={22} /> 
                        <span style={{ flexGrow: 1, textAlign: 'left' }}>Store Orders</span>
                        {activeTab === 'orders' && <ChevronRight size={18} />}
                    </button>
                    <button 
                        onClick={() => setActiveTab('users')}
                        style={{ 
                            display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.125rem 1.25rem', borderRadius: '16px', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 700,
                            background: activeTab === 'users' ? 'var(--primary)' : 'transparent',
                            color: activeTab === 'users' ? 'white' : 'var(--text-muted)',
                            transition: 'all 0.2s',
                            boxShadow: activeTab === 'users' ? '0 10px 15px -3px rgba(37, 99, 235, 0.25)' : 'none'
                        }}
                    >
                        <Users size={22} /> 
                        <span style={{ flexGrow: 1, textAlign: 'left' }}>Customer Insights</span>
                        {activeTab === 'users' && <ChevronRight size={18} />}
                    </button>
                </div>

                <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', padding: '0 1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                            {user.first_name[0]}
                        </div>
                        <div>
                            <p style={{ fontSize: '0.9rem', fontWeight: 700 }}>{user.first_name}</p>
                            <p style={{ fontSize: '0.7rem', color: 'var(--secondary)' }}>Administrator</p>
                        </div>
                    </div>
                    <button 
                        onClick={logout}
                        style={{ 
                            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '0.9375rem', fontWeight: 700,
                            background: '#fee2e2', color: '#ef4444', width: '100%', transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.background = '#fecaca'}
                        onMouseOut={(e) => e.target.style.background = '#fee2e2'}
                    >
                        <LogOut size={20} /> Terminate Session
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{ flexGrow: 1, padding: '4rem 5rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {activeTab === 'products' && (
                        <AdminProducts products={products} categories={categories} onRefresh={refreshData} user={user} />
                    )}
                    {activeTab === 'orders' && (
                        <AdminOrders user={user} />
                    )}
                    {activeTab === 'users' && (
                        <AdminUsers user={user} />
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
