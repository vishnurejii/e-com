import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Store from './pages/Store';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import MyOrders from './pages/MyOrders';
import OrderDetails from './pages/OrderDetails';
import Wishlist from './pages/Wishlist';
import SellerDashboard from './pages/SellerDashboard';
import ChatBot from './components/ChatBot';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import './styles/main.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <div className="App">
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={< Home />} />
                  <Route path="/store" element={< Store />} />
                  <Route path="/product/:id" element={< ProductDetail />} />
                  <Route path="/cart" element={< Cart />} />
                  <Route path="/checkout" element={< Checkout />} />
                  <Route path="/myorders" element={< MyOrders />} />
                  <Route path="/order/:id" element={< OrderDetails />} />
                  <Route path="/wishlist" element={< Wishlist />} />
                  <Route path="/seller" element={< SellerDashboard />} />
                  <Route path="/admin" element={< AdminDashboard />} />
                  <Route path="/login" element={< Login />} />
                  <Route path="/register" element={< Register />} />
                </Routes>
              </main>
              <ChatBot />
            </div>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
