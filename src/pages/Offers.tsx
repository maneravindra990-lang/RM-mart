import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Offer, Coupon } from '../types';
import { Tag, Gift, Clock, Sparkles, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Offers() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const q = query(collection(db, 'coupons'), where('active', '==', true));
        const snapshot = await getDocs(q);
        setCoupons(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Coupon)));
      } catch (error) {
        console.error('Failed to fetch coupons:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16 space-y-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest"
        >
          <Sparkles size={16} /> Exclusive Deals
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 italic tracking-tight">
          MEGA <span className="text-purple-600 underline decoration-wavy decoration-purple-200">SAVINGS</span> ZONE
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto font-medium">
          Grab the best discounts on your favorite products before they're gone!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {coupons.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
            <ShoppingBag size={48} className="mx-auto text-slate-300 mb-4" />
            <h2 className="text-xl font-bold text-slate-900">No active offers right now</h2>
            <p className="text-slate-500">Check back later for exciting festive deals!</p>
          </div>
        ) : (
          coupons.map((coupon, i) => (
            <motion.div
              key={coupon.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 p-8 overflow-hidden hover:shadow-2xl transition-all"
            >
              {/* Decorative elements */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-50 rounded-full group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-700" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-slate-900 text-white p-4 rounded-3xl font-black text-2xl italic tracking-tighter shadow-lg">
                    {coupon.code}
                  </div>
                  <div>
                    <p className="text-3xl font-black text-purple-600">{coupon.discountPercentage}% OFF</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Storewide Coupon</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <Clock size={18} className="text-orange-500" />
                    <span>Limited time offer!</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <Gift size={18} className="text-green-500" />
                    <span>Valid on all categories</span>
                  </div>
                  <div className="text-xs text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    * Minimum purchase of ₹{coupon.minOrderValue || 500} required. Maximum discount up to ₹{coupon.maxDiscount || 1000}.
                  </div>
                </div>

                <Link 
                  to="/" 
                  className="mt-auto w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 group-hover:bg-purple-600 transition-all"
                >
                  Shop Now <Tag size={18} />
                </Link>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Featured Banner */}
      <div className="mt-20 bg-purple-600 rounded-[3rem] p-12 text-white relative overflow-hidden">
        <Sparkles className="absolute top-10 right-10 text-white/20 w-48 h-48 animate-pulse" />
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl font-black mb-6">Want more?</h2>
          <p className="text-lg text-purple-100 mb-8 font-medium">
            Join RM Mart Rewards and get 250 points instantly. Use them to unlock secret coupons and VIP discounts!
          </p>
          <button className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold shadow-xl shadow-purple-900/20 hover:scale-105 transition-all">
            Join Rewards Now
          </button>
        </div>
      </div>
    </div>
  );
}
