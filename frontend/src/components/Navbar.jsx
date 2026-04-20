import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, ShoppingBag, LayoutDashboard, Heart, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const Navbar = () => {
    const { cartCount } = useCart();
    const { user, logout } = useAuth();
    const { wishlist } = useWishlist();

    return (
        <header>
            <div className="container navbar">
                <Link to="/" className="logo">
                    <ShoppingBag size={28} />
                    <span>NewKart</span>
                </Link>
                <nav className="nav-links">
                    <Link to="/store">Store</Link>
                    {user && (
                        <>
                            <Link to="/wishlist" title="Wishlist" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <Heart size={22} color="#ef4444" fill={wishlist.length > 0 ? "#ef4444" : "none"} />
                                {wishlist.length > 0 && <span style={{ position: 'absolute', top: '-8px', right: '-10px', background: 'var(--text)', color: 'white', fontSize: '0.65rem', fontWeight: 800, width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{wishlist.length}</span>}
                            </Link>
                            {!user.is_seller && !user.is_staff && !user.is_superadmin && user.first_name !== 'Admin' && (
                                <Link to="/myorders" title="My Orders">
                                    <Package size={22} />
                                </Link>
                            )}
                        </>
                    )}
                    {user && user.is_seller && (
                        <Link to="/seller" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8b5cf6', fontWeight: 800 }}>
                            <LayoutDashboard size={18} /> Seller Dashboard
                        </Link>
                    )}
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
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>{user.first_name || 'User'}</span>
                                <button onClick={logout} style={{ background: 'none', border: 'none', padding: 0, fontSize: '0.75rem', color: '#ef4444', cursor: 'pointer', fontWeight: 700 }}>Logout</button>
                            </div>
                            <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>
                                {user.first_name ? user.first_name[0] : 'U'}
                            </div>
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
