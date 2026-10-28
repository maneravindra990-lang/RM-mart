import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, subtotal } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-12 shadow-sm border border-slate-100 max-w-lg mx-auto"
        >
          <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="text-purple-600" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
          <p className="text-slate-500 mb-8">Looks like you haven't added anything to your cart yet. Explore our latest collections!</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-purple-100">
            Start Shopping <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    );
  }

  const deliveryCharges = subtotal > 500 ? 0 : 40;
  const total = subtotal + deliveryCharges;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center gap-2 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold text-slate-900">Your Shopping Cart</h1>
        <span className="text-slate-400 text-lg font-medium ml-2">({cart.length} items)</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-100 shadow-sm flex gap-6">
              <div className="w-24 h-32 sm:w-32 sm:h-40 rounded-xl overflow-hidden bg-slate-50 shrink-0">
                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-slate-900 md:text-lg">{item.name}</h3>
                    <button 
                      onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{item.brand} · {item.category}</p>
                  {(item.selectedSize || item.selectedColor) && (
                    <div className="flex gap-4 text-xs font-medium text-slate-600 mb-4">
                      {item.selectedSize && <span className="bg-slate-100 px-2 py-1 rounded">Size: {item.selectedSize}</span>}
                      {item.selectedColor && <span className="bg-slate-100 px-2 py-1 rounded">Color: {item.selectedColor}</span>}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center bg-slate-100 rounded-lg p-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize, item.selectedColor)}
                      className="p-1.5 hover:bg-white rounded-md transition-all text-slate-600"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize, item.selectedColor)}
                      className="p-1.5 hover:bg-white rounded-md transition-all text-slate-600"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-purple-600">₹{item.price * item.quantity}</p>
                    <p className="text-[10px] text-slate-400">₹{item.price} each</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charges</span>
                <span className={deliveryCharges === 0 ? 'text-green-600 font-bold' : 'font-semibold text-slate-900'}>
                  {deliveryCharges === 0 ? 'FREE' : `₹${deliveryCharges}`}
                </span>
              </div>
              {deliveryCharges > 0 && (
                <p className="text-[10px] text-purple-600 bg-purple-50 p-2 rounded-lg text-center">
                  Add ₹{500 - subtotal} more for FREE delivery!
                </p>
              )}
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-lg font-bold text-slate-900">Total</span>
                <span className="text-2xl font-black text-purple-600">₹{total}</span>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              Checkout Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            <p className="text-center text-[10px] text-slate-400 mt-6 uppercase tracking-widest font-bold">
              Secure Checkout Powered by RM Mart
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
