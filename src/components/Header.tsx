import React, { useState } from 'react';
import { ShoppingCart, Search, User, Menu, X, LogOut, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Header() {
  const { totalItems } = useCart();
  const { user, isAdmin, login, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
      setIsMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src="/src/assets/images/rm_mart_logo_1793221625071.jpg" alt="RM Mart Logo" className="w-10 h-10 object-contain" />
          <span className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap">RM Mart</span>
        </Link>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link to="/category/fashion" className="hover:text-purple-600 transition-colors whitespace-nowrap">Fashion</Link>
          <Link to="/category/electronics" className="hover:text-purple-600 transition-colors whitespace-nowrap">Electronics</Link>
          <Link to="/category/clothing" className="hover:text-purple-600 transition-colors whitespace-nowrap">Clothing</Link>
          <Link to="/offers" className="hover:text-purple-600 transition-colors whitespace-nowrap">Offers</Link>
        </nav>

        {/* Search Bar (Desktop) */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 border-none rounded-full py-2 pl-4 pr-10 text-sm focus:ring-2 focus:ring-purple-500 transition-all"
          />
          <button type="submit" className="absolute right-3 text-slate-400 hover:text-purple-600">
            <Search size={18} />
          </button>
        </form>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-4 shrink-0">
          <Link to="/cart" className="relative p-2 text-slate-600 hover:text-purple-600 transition-colors">
            <ShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {totalItems}
              </span>
            )}
          </Link>
          
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="p-1.5 text-slate-600 hover:text-purple-600 transition-colors flex items-center gap-2 bg-slate-50 rounded-full pr-3 border border-slate-100"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs">
                      {user.displayName?.charAt(0) || user.email?.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-700 hidden lg:block">My Account</span>
              </button>
              
              <button 
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all"
              >
                <LogOut size={16} /> Logout
              </button>
              
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in duration-200">
                  <div className="px-4 py-2 border-b border-slate-50 mb-2">
                    <p className="text-xs font-bold text-slate-400 uppercase">Signed in as</p>
                    <p className="text-sm font-semibold text-slate-900 truncate">{user.displayName || user.email}</p>
                  </div>
                  <Link to="/account" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                    <User size={18} /> My Profile
                  </Link>
                  {isAdmin && (
                    <Link to="/owner-admin" className="flex items-center gap-3 px-4 py-2 text-sm text-purple-600 font-bold hover:bg-purple-50 transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                      <Settings size={18} /> Admin Panel
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                  >
                    <LogOut size={18} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={login} className="text-sm font-semibold text-purple-600 hover:text-purple-700 px-3 py-1.5 rounded-lg hover:bg-purple-50 transition-all">
              Login
            </button>
          )}

          <button 
            className="lg:hidden p-2 text-slate-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 py-4 px-4 shadow-xl animate-in slide-in-from-top duration-300">
          <form onSubmit={handleSearch} className="mb-4 relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 rounded-lg py-2 px-4 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            />
            <button type="submit" className="absolute right-3 top-2 text-slate-400">
              <Search size={18} />
            </button>
          </form>
          <nav className="flex flex-col gap-1">
            <Link to="/category/fashion" className="px-3 py-3 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors" onClick={() => setIsMenuOpen(false)}>Fashion & Beauty</Link>
            <Link to="/category/electronics" className="px-3 py-3 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors" onClick={() => setIsMenuOpen(false)}>Electronics & Gadgets</Link>
            <Link to="/category/clothing" className="px-3 py-3 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors" onClick={() => setIsMenuOpen(false)}>Clothing & Shoes</Link>
            <Link to="/offers" className="px-3 py-3 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors" onClick={() => setIsMenuOpen(false)}>Special Offers</Link>
            <Link to="/track-order" className="px-3 py-3 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors" onClick={() => setIsMenuOpen(false)}>Track Order</Link>
            {user && (
              <>
                <div className="h-px bg-slate-100 my-2" />
                <Link to="/account" className="px-3 py-3 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
                  <User size={18} /> My Account
                </Link>
                {isAdmin && (
                  <Link to="/owner-admin" className="px-3 py-3 rounded-lg text-purple-600 font-bold hover:bg-purple-50 transition-colors flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
                    <Settings size={18} /> Admin Panel
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="px-3 py-3 rounded-lg text-red-600 font-medium hover:bg-red-50 transition-colors flex items-center gap-3 w-full text-left"
                >
                  <LogOut size={18} /> Sign Out
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
