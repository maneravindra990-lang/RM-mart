import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Order } from '../types';
import { CheckCircle, Package, Truck, Home, ArrowRight, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const docSnap = await getDoc(doc(db, 'orders', id));
        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() } as Order);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const copyId = () => {
    if (id) {
      navigator.clipboard.writeText(id);
      toast.success('Order ID copied!');
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!order) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Order Not Found</h2>
      <Link to="/" className="text-purple-600 font-bold hover:underline">Return to Home</Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-purple-600 p-8 text-center text-white">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-purple-100">Thank you for shopping with RM Mart.</p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Order Number</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-mono font-bold text-slate-900">{id}</p>
                <button onClick={copyId} className="p-1.5 text-slate-400 hover:text-purple-600 transition-colors">
                  <Copy size={16} />
                </button>
              </div>
            </div>
            <div className="md:text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
              <p className="text-lg font-bold text-green-600">PENDING CONFIRMATION</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Package className="text-purple-600" size={20} /> Order Summary
            </h3>
            <div className="divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex justify-between items-center text-sm">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">Qty: {item.quantity} {item.selectedSize ? `· Size: ${item.selectedSize}` : ''}</p>
                  </div>
                  <p className="font-bold text-slate-900">₹{item.price * item.quantity}</p>
                </div>
              ))}
              <div className="pt-4 flex justify-between items-center">
                <span className="text-lg font-bold text-slate-900">Total Amount</span>
                <span className="text-2xl font-black text-purple-600">₹{order.finalAmount}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Truck className="text-purple-600" size={20} /> Delivery To
            </h3>
            <div className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="font-bold text-slate-900 mb-1">{order.customerDetails.fullName}</p>
              <p>{order.customerDetails.address}</p>
              <p>{order.customerDetails.city}, {order.customerDetails.state} - {order.customerDetails.pinCode}</p>
              <p className="mt-2 font-medium">Mobile: {order.customerDetails.mobile}</p>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row gap-4">
            <Link to="/track-order" className="flex-1 bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-bold text-center transition-all flex items-center justify-center gap-2">
              Track Order <Truck size={20} />
            </Link>
            <Link to="/" className="flex-1 bg-white border-2 border-slate-100 hover:border-purple-600 hover:text-purple-600 py-4 rounded-2xl font-bold text-slate-600 text-center transition-all flex items-center justify-center gap-2">
              Back to Home <Home size={20} />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
