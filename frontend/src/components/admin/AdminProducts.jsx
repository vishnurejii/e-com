import React, { useState } from 'react';
import axios from 'axios';
import { Package, Plus, Trash2, Edit, Tag } from 'lucide-react';
import ProductModal from './ProductModal';

const AdminProducts = ({ products, categories, onRefresh, user }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    const openModal = (product = null) => {
        setCurrentProduct(product);
        setIsModalOpen(true);
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`http://localhost:5000/api/products/${id}`, config);
                onRefresh();
            } catch (error) {
                console.error(error);
                alert('Error deleting product');
            }
        }
    };

    const saveHandler = async (prodData) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            if (prodData._id) {
                await axios.put(`http://localhost:5000/api/products/${prodData._id}`, prodData, config);
            } else {
                await axios.post('http://localhost:5000/api/products', prodData, config);
            }
            setIsModalOpen(false);
            onRefresh();
        } catch (error) {
            console.error(error);
            alert('Error saving product details');
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.04em' }}>Inventory Management</h2>
                <button className="btn btn-primary" style={{ padding: '0.875rem 1.75rem' }} onClick={() => openModal()}>
                    <Plus size={20} /> Add New Item
                </button>
            </div>
            
            <div style={{ background: 'white', borderRadius: '24px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
                <table className="admin-table" style={{ margin: 0 }}>
                    <thead style={{ background: '#f8fafc' }}>
                        <tr>
                            <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)' }}>Product Details</th>
                            <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)' }}>Category</th>
                            <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)' }}>Unit Price</th>
                            <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)' }}>Stock Level</th>
                            <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>No products found in inventory.</td>
                            </tr>
                        ) : (
                            products.map(p => (
                                <tr key={p._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: '#f1f5f9', overflow: 'hidden' }}>
                                                <img src={p.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: 800, marginBottom: '0.1rem', fontSize: '1rem' }}>{p.product_name}</p>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>ID: {p._id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#f1f5f9', padding: '0.4rem 0.875rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>
                                            <Tag size={14} /> {p.category?.category_name || 'General Product'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem', fontWeight: 800, color: 'var(--primary)', fontSize: '1.125rem' }}>${p.price.toFixed(2)}</td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.stock > 10 ? '#10b981' : p.stock > 0 ? '#f59e0b' : '#ef4444' }}></div>
                                            <span style={{ fontWeight: 600 }}>{p.stock} left</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                            <button onClick={() => openModal(p)} style={{ border: 'none', background: '#eff6ff', color: 'var(--primary)', width: '38px', height: '38px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => deleteHandler(p._id)} style={{ border: 'none', background: '#fee2e2', color: '#ef4444', width: '38px', height: '38px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <ProductModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                product={currentProduct} 
                onSave={saveHandler}
                categories={categories}
            />
        </div>
    );
};

export default AdminProducts;
