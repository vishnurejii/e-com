import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Plus, Edit, Trash2, X, Check } from 'lucide-react';

const SellerProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        product_name: '',
        slug: '',
        price: '',
        stock: '',
        description: '',
        category: '',
        image: '',
        is_available: true
    });

    if (!user) return null;

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products?sellerId=${user._id}`);
            setProducts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/categories`);
        setCategories(data);
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            if (editingProduct) {
                await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/${editingProduct._id}`, formData, config);
            } else {
                // Generate slug if empty
                const finalData = { ...formData, slug: formData.slug || formData.product_name.toLowerCase().replace(/ /g, '-') };
                await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`, finalData, config);
            }
            setShowModal(false);
            setEditingProduct(null);
            setFormData({ product_name: '', slug: '', price: '', stock: '', description: '', category: '', image: '', is_available: true });
            fetchProducts();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Operation failed. Please check product details andTry again.');
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Delete this product?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/${id}`, config);
                fetchProducts();
            } catch (error) {
                console.error(error);
            }
        }
    };

    if (loading) return <div>Loading repository...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Manage Catalog</h2>
                <button 
                    onClick={() => { setEditingProduct(null); setShowModal(true); }}
                    className="btn btn-primary"
                    style={{ padding: '0.875rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Plus size={20} /> Add New Product
                </button>
            </div>

            <div style={{ background: 'white', borderRadius: '24px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
                <table className="admin-table" style={{ margin: 0 }}>
                    <thead>
                        <tr style={{ background: '#f8fafc' }}>
                            <th style={{ padding: '1.25rem 1.5rem' }}>Product & Category</th>
                            <th style={{ padding: '1.25rem 1.5rem' }}>Price</th>
                            <th style={{ padding: '1.25rem 1.5rem' }}>Stock Level</th>
                            <th style={{ padding: '1.25rem 1.5rem' }}>Status</th>
                            <th style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1.25rem 1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <img src={p.image} alt="" style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }} />
                                        <div>
                                            <p style={{ fontWeight: 800 }}>{p.product_name}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.category?.category_name}</p>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem 1.5rem', fontWeight: 700 }}>${p.price.toFixed(2)}</td>
                                <td style={{ padding: '1.25rem 1.5rem' }}>
                                    <span style={{ 
                                        padding: '0.25rem 0.75rem', 
                                        borderRadius: '10px', 
                                        background: p.stock > 10 ? '#f1f5f9' : '#fee2e2',
                                        color: p.stock > 10 ? 'var(--text)' : '#ef4444',
                                        fontSize: '0.875rem',
                                        fontWeight: 700
                                    }}>
                                        {p.stock} in stock
                                    </span>
                                </td>
                                <td style={{ padding: '1.25rem 1.5rem' }}>
                                    {p.is_available ? (
                                        <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 600 }}>
                                            <Check size={16} /> Available
                                        </span>
                                    ) : (
                                        <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 600 }}>
                                            <X size={16} /> Unavailable
                                        </span>
                                    )}
                                </td>
                                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                        <button 
                                            onClick={() => { setEditingProduct(p); setFormData(p); setShowModal(true); }}
                                            style={{ padding: '0.5rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer' }}
                                        >
                                            <Edit size={18} color="var(--primary)" />
                                        </button>
                                        <button 
                                            onClick={() => deleteHandler(p._id)}
                                            style={{ padding: '0.5rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer' }}
                                        >
                                            <Trash2 size={18} color="#ef4444" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
                    <div style={{ background: 'white', padding: '3rem', borderRadius: '32px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label>Product Name</label>
                                <input type="text" name="product_name" className="form-control" value={formData.product_name} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Price ($)</label>
                                <input type="number" name="price" className="form-control" value={formData.price} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Stock Quantity</label>
                                <input type="number" name="stock" className="form-control" value={formData.stock} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select name="category" className="form-control" value={formData.category} onChange={handleChange} required>
                                    <option value="">Select Category</option>
                                    {categories.map(c => <option key={c._id} value={c._id}>{c.category_name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Image URL</label>
                                <input type="text" name="image" className="form-control" value={formData.image} onChange={handleChange} placeholder="https://..." required />
                            </div>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label>Description</label>
                                <textarea name="description" className="form-control" value={formData.description} onChange={handleChange} style={{ minHeight: '120px' }} />
                            </div>
                            <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: '#f8fafc', borderRadius: '16px' }}>
                                <input type="checkbox" name="is_available" id="is_avail" checked={formData.is_available} onChange={handleChange} />
                                <label htmlFor="is_avail" style={{ margin: 0, fontWeight: 700 }}>Make product available for sale</label>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 2', padding: '1.25rem', marginTop: '1rem' }}>
                                {editingProduct ? 'Update Product' : 'List Product'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerProducts;
