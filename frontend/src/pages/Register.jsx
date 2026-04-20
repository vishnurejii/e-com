import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Store as StoreIcon } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        is_seller: false,
        shopName: '',
        shopDescription: ''
    });
    const { login } = useAuth();
    const navigate = useNavigate();

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
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/register`, formData);
            login(data);
            navigate(data.is_seller ? '/seller' : '/');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="container" style={{ padding: '5rem 0', display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: 'white', padding: '3rem', borderRadius: '32px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xl)', width: '100%', maxWidth: '600px' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '1rem', fontWeight: 800, letterSpacing: '-0.05em', fontSize: '2.5rem' }}>Create Account</h1>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3rem' }}>Join NewKart today as a customer or shop owner.</p>
                
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label>First Name</label>
                            <input type="text" name="first_name" className="form-control" placeholder="John" value={formData.first_name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" name="last_name" className="form-control" placeholder="Doe" value={formData.last_name} onChange={handleChange} required />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" name="username" className="form-control" placeholder="johndoe123" value={formData.username} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" name="email" className="form-control" placeholder="john@example.com" value={formData.email} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" className="form-control" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                    </div>

                    <div style={{ margin: '2rem 0', padding: '1.5rem', background: '#f8fafc', borderRadius: '20px', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <input 
                                type="checkbox" 
                                name="is_seller" 
                                id="is_seller" 
                                checked={formData.is_seller} 
                                onChange={handleChange}
                                style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }}
                            />
                            <label htmlFor="is_seller" style={{ fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <StoreIcon size={20} color="var(--primary)" /> I want to sell products on NewKart
                            </label>
                        </div>
                        
                        {formData.is_seller && (
                            <div style={{ marginTop: '1.5rem', animation: 'fadeIn 0.3s ease-in-out' }}>
                                <div className="form-group">
                                    <label>Shop Name</label>
                                    <input 
                                        type="text" 
                                        name="shopName" 
                                        className="form-control" 
                                        placeholder="My Awesome Store" 
                                        value={formData.shopName} 
                                        onChange={handleChange} 
                                        required={formData.is_seller}
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label>Shop Description</label>
                                    <textarea 
                                        name="shopDescription" 
                                        className="form-control" 
                                        placeholder="Briefly describe what you sell..." 
                                        value={formData.shopDescription} 
                                        onChange={handleChange}
                                        style={{ minHeight: '100px' }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1.125rem' }}>
                        Start Your Journey
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
