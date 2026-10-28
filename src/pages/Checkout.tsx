import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { ShoppingBag, CreditCard, Truck, CheckCircle, ChevronLeft, ArrowRight, Wallet } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function Checkout() {
  const { cart, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    paymentMethod: 'COD' as 'COD' | 'UPI' | 'ONLINE',
  });

  React.useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart.length, navigate]);

  if (cart.length === 0) {
    return null;
  }

  const deliveryCharges = subtotal > 500 ? 0 : 40;
  const total = subtotal + deliveryCharges;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create Order in Firestore
      const orderData = {
        customerDetails: {
          fullName: formData.fullName,
          mobile: formData.mobile,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pinCode: formData.pinCode,
        },
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize || null,
          selectedColor: item.selectedColor || null,
        })),
        totalAmount: subtotal,
        discount: 0,
        finalAmount: total,
        paymentMethod: formData.paymentMethod,
        paymentStatus: 'PENDING',
        orderStatus: 'PENDING',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      
      // 2. Notify Owner via Email (Server-side)
      await fetch('/api/orders/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          order: { id: docRef.id, ...orderData },
          ownerEmail: 'maneravindra990@gmail.com'
        })
      });

      // 3. Success Flow
      toast.success('Order placed successfully!');
      clearCart();
      navigate(`/order-confirmation/${docRef.id}`);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center gap-2 mb-8">
        <button onClick={() => navigate('/cart')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Address */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
              <Truck className="text-purple-600" size={24} />
              <h2 className="text-xl font-bold text-slate-900">Shipping Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Full Name *</label>
                <input 
                  type="text" required 
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none" 
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Mobile Number *</label>
                <input 
                  type="tel" required 
                  value={formData.mobile}
                  onChange={e => setFormData({...formData, mobile: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none" 
                  placeholder="10-digit mobile number"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address *</label>
                <input 
                  type="email" required 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none" 
                  placeholder="yourname@example.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Full Delivery Address *</label>
                <textarea 
                  required 
                  rows={3}
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none" 
                  placeholder="House No, Building, Street, Area"
                ></textarea>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">City *</label>
                <input 
                  type="text" required 
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">State *</label>
                <input 
                  type="text" required 
                  value={formData.state}
                  onChange={e => setFormData({...formData, state: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">PIN Code *</label>
                <input 
                  type="text" required 
                  value={formData.pinCode}
                  onChange={e => setFormData({...formData, pinCode: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none" 
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
              <CreditCard className="text-purple-600" size={24} />
              <h2 className="text-xl font-bold text-slate-900">Payment Method</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'COD', name: 'Cash on Delivery', icon: Wallet },
                { id: 'UPI', name: 'UPI Payment', icon: CreditCard },
                { id: 'ONLINE', name: 'Online Payment', icon: CreditCard },
              ].map(method => (
                <label 
                  key={method.id}
                  className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                    formData.paymentMethod === method.id 
                      ? 'border-purple-600 bg-purple-50' 
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="payment" 
                    value={method.id}
                    checked={formData.paymentMethod === method.id}
                    onChange={() => setFormData({...formData, paymentMethod: method.id as any})}
                    className="hidden" 
                  />
                  <method.icon size={24} className={formData.paymentMethod === method.id ? 'text-purple-600' : 'text-slate-400'} />
                  <span className={`text-xs font-bold mt-2 ${formData.paymentMethod === method.id ? 'text-purple-900' : 'text-slate-500'}`}>
                    {method.name}
                  </span>
                  {formData.paymentMethod === method.id && (
                    <div className="absolute top-2 right-2 text-purple-600">
                      <CheckCircle size={16} />
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Final Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6">
              {cart.map(item => (
                <div key={`${item.id}-${item.selectedSize}`} className="flex justify-between text-xs text-slate-600">
                  <span className="truncate max-w-[150px]">{item.name} x {item.quantity}</span>
                  <span className="font-semibold">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div className="flex justify-between text-slate-600 text-sm">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-sm">
                <span>Delivery Charges</span>
                <span className={deliveryCharges === 0 ? 'text-green-600 font-bold' : 'font-semibold text-slate-900'}>
                  {deliveryCharges === 0 ? 'FREE' : `₹${deliveryCharges}`}
                </span>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-lg font-bold text-slate-900">Total</span>
                <span className="text-2xl font-black text-purple-600">₹{total}</span>
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-4 rounded-2xl font-bold text-lg shadow-lg mt-8 transition-all flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Place Order <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
            
            <p className="text-center text-[10px] text-slate-400 mt-6 uppercase tracking-widest font-bold">
              100% Secure Checkout
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
