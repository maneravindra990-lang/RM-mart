import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderTracking from './pages/OrderTracking';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminOffers from './pages/AdminOffers';
import AdminSettings from './pages/AdminSettings';
import ProductDetails from './pages/ProductDetails';
import Account from './pages/Account';
import Category from './pages/Category';
import Search from './pages/Search';
import Offers from './pages/Offers';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Layout wrapper to conditionally hide header/footer if needed (e.g. for some admin views)
function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/owner-admin');

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans selection:bg-purple-100 selection:text-purple-900">
      {!isAdminPath && <Header />}
      <main className="flex-1">
        {children}
      </main>
      {!isAdminPath && <Footer />}
      {!isAdminPath && <Chatbot />}
    </div>
  );
}

// Placeholder pages to be implemented
const Placeholder = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
    <h2 className="text-3xl font-bold text-slate-900 mb-4">{title}</h2>
    <p className="text-slate-500 max-w-md">This page is currently being prepared for the RM Mart experience. Check back soon!</p>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/category/:cat" element={<Category />} />
              <Route path="/search" element={<Search />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
              <Route path="/track-order" element={<OrderTracking />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/account" element={<Account />} />
              
              {/* Admin Routes */}
              <Route path="/owner-admin" element={<AdminDashboard />} />
              <Route path="/owner-admin/products" element={<AdminProducts />} />
              <Route path="/owner-admin/orders" element={<AdminOrders />} />
              <Route path="/owner-admin/offers" element={<AdminOffers />} />
              <Route path="/owner-admin/settings" element={<AdminSettings />} />
              
              <Route path="*" element={<Placeholder title="404 - Not Found" />} />
            </Routes>
          </Layout>
          <Toaster position="bottom-center" />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
