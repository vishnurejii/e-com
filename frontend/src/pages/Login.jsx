import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('http://localhost:5000/api/users/login', { email, password });
            login(data);
            navigate('/');
        } catch (error) {
            console.error(error);
            alert('Invalid credentials. Use admin@example.com / password123 for testing.');
        }
    };

    return (
        <div className="container" style={{ padding: '8rem 0', display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: 'white', padding: '3rem', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: '450px' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontWeight: 800, letterSpacing: '-0.05em', fontSize: '2.5rem' }}>
                    <LogIn size={32} color="var(--primary)" /> Sign In
                </h1>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Access your personalized shopping experience.</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" className="form-control" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.25rem', marginTop: '1.5rem', fontSize: '1.125rem' }}>Continue to NewKart</button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)' }}>
                    New to NewKart? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Create an Account</Link>
                </p>

                <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: '#f1f5f9', borderRadius: '16px', border: '1px dashed var(--border)' }}>
                    <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        <b>Developer Mode:</b> Use these credentials to test Admin features:
                        <br/>
                        <code style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>admin@example.com / password123</code>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
