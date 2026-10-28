import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Package, LogOut, ChevronRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Account() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-12 shadow-sm border border-slate-100 max-w-lg mx-auto"
        >
          <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="text-purple-600" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Please login</h2>
          <p className="text-slate-500 mb-8">Login to view your orders, saved addresses and profile details.</p>
          <button 
            onClick={() => navigate('/')} 
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-purple-100"
          >
            Go to Login
          </button>
        </motion.div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Account</h1>
        <p className="text-slate-500">Manage your profile and track your orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm text-center">
            <div className="relative inline-block mb-4">
              <img 
                src={user.photoURL || 'https://via.placeholder.com/100'} 
                alt={user.displayName || ''} 
                className="w-24 h-24 rounded-full border-4 border-purple-50 shadow-sm object-cover"
              />
              <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-4 border-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">{user.displayName}</h2>
            <p className="text-sm text-slate-500 truncate mb-6">{user.email}</p>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white py-3 rounded-2xl font-bold transition-all"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>

          <div className="bg-purple-600 rounded-[2rem] p-6 text-white overflow-hidden relative">
            <ShieldCheck className="absolute -right-4 -bottom-4 text-white/10 w-32 h-32" />
            <h3 className="font-bold mb-2">RM Mart Rewards</h3>
            <p className="text-sm text-purple-100 mb-4 leading-relaxed">You have 250 points! Shop more to unlock exclusive discounts.</p>
            <button className="text-xs font-bold bg-white text-purple-600 px-4 py-2 rounded-lg">View Rewards</button>
          </div>
        </div>

        {/* Main Sections */}
        <div className="md:col-span-2 space-y-6">
          {/* Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/track-order" className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-purple-200 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Package size={24} />
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-purple-600 transition-colors" />
              </div>
              <h3 className="font-bold text-slate-900">My Orders</h3>
              <p className="text-xs text-slate-500">Track and view history</p>
            </Link>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-purple-200 transition-all group cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                  <MapPin size={24} />
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-purple-600 transition-colors" />
              </div>
              <h3 className="font-bold text-slate-900">Saved Addresses</h3>
              <p className="text-xs text-slate-500">Manage delivery spots</p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <User className="text-purple-600" size={20} /> Personal Information
            </h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Full Name</p>
                  <p className="text-sm font-semibold text-slate-900">{user.displayName || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                  <p className="text-sm font-semibold text-slate-900">{user.email}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone Number</p>
                  <p className="text-sm font-semibold text-slate-900">{user.phoneNumber || 'Not linked'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Language</p>
                  <p className="text-sm font-semibold text-slate-900">English (IN)</p>
                </div>
              </div>
              <button className="text-sm font-bold text-purple-600 hover:underline">Edit Profile Details</button>
            </div>
          </div>

          {/* Security */}
          <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Data Privacy</h3>
                <p className="text-xs text-slate-500">We keep your personal information secure and encrypted.</p>
              </div>
              <button className="text-sm font-bold bg-white border border-slate-200 px-6 py-2 rounded-xl hover:bg-slate-100 transition-colors">
                Manage Privacy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
