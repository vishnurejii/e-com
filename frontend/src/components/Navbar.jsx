import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, ShoppingBag, LayoutDashboard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { cartCount } = useCart();
    const { user, logout } = useAuth();

    return (
        <header>
            <div className="container navbar">
                <Link to="/" className="logo">
                    <ShoppingBag size={28} />
                    <span>NewKart</span>
                </Link>
                <nav className="nav-links">
                    <Link to="/store">Store</Link>
                    {user && (user.is_staff || user.is_superadmin || user.first_name === 'Admin') && (
                        <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 800 }}>
                            <LayoutDashboard size={18} /> Admin Console
                        </Link>
                    )}
                    <Link to="/cart" className="cart-icon">
                        <ShoppingCart size={22} />
                        {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                    </Link>
                    {user ? (
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Hi, {user.first_name}</span>
                            <button onClick={logout} className="btn btn-sm" style={{ background: '#fee2e2', color: '#ef4444' }}>Logout</button>
                        </div>
                    ) : (
                        <Link to="/login"><User size={22} /></Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
