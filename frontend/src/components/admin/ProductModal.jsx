import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ProductModal = ({ isOpen, onClose, product, onSave, categories }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState(0);
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (product) {
            setName(product.product_name || '');
            setPrice(product.price || 0);
            setImage(product.image || '');
            setCategory(product.category?._id || product.category || '');
            setStock(product.stock || 0);
            setDescription(product.description || '');
        } else {
            setName('');
            setPrice(0);
            setImage('');
            setCategory('');
            setStock(0);
            setDescription('');
        }
    }, [product]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            _id: product?._id,
            product_name: name,
            price,
            image,
            category,
            stock,
            description
        });
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', width: '100%', maxWidth: '500px', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', border: 'none', background: '#f1f5f9', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)' }}>
                    <X size={20} />
                </button>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2rem', letterSpacing: '-0.025em' }}>{product ? 'Edit Product' : 'Add New Product'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Product Name</label>
                        <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label>Price ($)</label>
                            <input type="number" className="form-control" value={price} onChange={e => setPrice(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Stock Quantity</label>
                            <input type="number" className="form-control" value={stock} onChange={e => setStock(e.target.value)} required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select className="form-control" value={category} onChange={e => setCategory(e.target.value)} required>
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.category_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Image URL</label>
                        <input type="text" className="form-control" value={image} onChange={e => setImage(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea className="form-control" style={{ resize: 'none' }} rows="3" value={description} onChange={e => setDescription(e.target.value)} required></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.25rem', marginTop: '1.5rem', fontSize: '1.125rem' }}>
                        {product ? 'Update Details' : 'Publish Product'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;
