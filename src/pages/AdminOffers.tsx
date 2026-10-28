import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Offer, Coupon } from '../types';
import AdminLayout from '../components/AdminLayout';
import { Plus, Tag, Trash2, CheckCircle, XCircle, Clock, Gift } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const offersSnap = await getDocs(collection(db, 'offers'));
      setOffers(offersSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Offer)));
      
      const couponsSnap = await getDocs(collection(db, 'coupons'));
      setCoupons(couponsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Coupon)));
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const createCoupon = async () => {
    const code = prompt('Enter Coupon Code (e.g. DIWALI50):');
    if (!code) return;
    const discount = Number(prompt('Enter Discount Percentage:'));
    if (!discount) return;

    try {
      await addDoc(collection(db, 'coupons'), {
        code: code.toUpperCase(),
        discountPercentage: discount,
        minOrderValue: 500,
        maxDiscount: 1000,
        expiryDate: Timestamp.now(),
        active: true,
      });
      toast.success('Coupon created');
      fetchData();
    } catch (error) {
      toast.error('Failed to create coupon');
    }
  };

  const deleteCoupon = async (id: string) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await deleteDoc(doc(db, 'coupons', id));
      toast.success('Coupon deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete coupon');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-12">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Offers & Coupons</h1>
            <p className="text-slate-500 text-sm">Manage discounts and seasonal promotions</p>
          </div>
        </div>

        {/* Coupons Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Gift className="text-purple-600" size={20} /> Active Coupons
            </h2>
            <button onClick={createCoupon} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold transition-all">
              <Plus size={18} /> New Coupon
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => deleteCoupon(coupon.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-purple-100 text-purple-600 p-3 rounded-2xl font-black text-xl italic tracking-tighter">
                    {coupon.code}
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900">{coupon.discountPercentage}% OFF</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Storewide Coupon</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock size={14} />
                    <span>Expires soon</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${coupon.active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {coupon.active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Offers Placeholder */}
        <div className="bg-slate-900 rounded-[2rem] p-12 text-center text-white">
          <Tag size={48} className="mx-auto text-purple-400 mb-6" />
          <h2 className="text-3xl font-bold mb-4">Special Campaign Management</h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-8">
            Create multi-product offers, buy-one-get-one deals, and category-specific discounts.
          </p>
          <button className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-purple-400 hover:text-white transition-all">
            Create Campaign
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
