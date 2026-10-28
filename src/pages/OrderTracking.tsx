import React, { useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Order } from '../types';
import { Search, Package, Truck, CheckCircle, Clock, MapPin, AlertCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function OrderTracking() {
  const [orderId, setOrderId] = useState('');
  const [mobile, setMobile] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !mobile) {
      toast.error('Please enter both Order ID and Mobile Number');
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const docRef = doc(db, 'orders', orderId.trim());
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() } as Order;
        if (data.customerDetails.mobile.includes(mobile.trim())) {
          setOrder(data);
        } else {
          setOrder(null);
          toast.error('Invalid Order ID or Mobile Number');
        }
      } else {
        setOrder(null);
        toast.error('Order not found');
      }
    } catch (error) {
      console.error('Track error:', error);
      toast.error('Failed to track order');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status: string) => {
    const statuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    return statuses.indexOf(status);
  };

  const steps = [
    { name: 'Order Placed', status: 'PENDING', icon: Clock },
    { name: 'Confirmed', status: 'CONFIRMED', icon: CheckCircle },
    { name: 'Processing', status: 'PROCESSING', icon: Package },
    { name: 'Shipped', status: 'SHIPPED', icon: Truck },
    { name: 'Out for Delivery', status: 'OUT_FOR_DELIVERY', icon: MapPin },
    { name: 'Delivered', status: 'DELIVERED', icon: CheckCircle },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Track Your Order</h1>
        <p className="text-slate-500">Enter your Order ID and Registered Mobile Number to check your delivery status.</p>
      </div>

      <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden mb-12">
        <form onSubmit={handleTrack} className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Order ID</label>
            <input 
              type="text" 
              value={orderId}
              onChange={e => setOrderId(e.target.value)}
              placeholder="e.g. 5xT8y..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Mobile Number</label>
            <input 
              type="tel" 
              value={mobile}
              onChange={e => setMobile(e.target.value)}
              placeholder="10-digit number"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-purple-100 flex items-center justify-center gap-2"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Search size={20} /> Track Now</>}
          </button>
        </form>
      </div>

      <AnimatePresence>
        {searched && order && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Status Visualizer */}
            <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100">
              <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
                <div className="text-center md:text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <h3 className="text-2xl font-bold text-purple-600 uppercase">{order.orderStatus.replace(/_/g, ' ')}</h3>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Expected Delivery</p>
                  <h3 className="text-lg font-bold text-slate-900">3-5 Business Days</h3>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="relative flex flex-col md:flex-row justify-between gap-8 md:gap-4">
                {/* Connector Line (Desktop) */}
                <div className="hidden md:block absolute top-6 left-0 right-0 h-0.5 bg-slate-100 z-0">
                  <div 
                    className="h-full bg-purple-600 transition-all duration-1000" 
                    style={{ width: `${(getStatusIndex(order.orderStatus) / (steps.length - 1)) * 100}%` }}
                  />
                </div>

                {steps.map((step, idx) => {
                  const isCompleted = getStatusIndex(order.orderStatus) >= idx;
                  const isCurrent = order.orderStatus === step.status;

                  return (
                    <div key={idx} className="relative z-10 flex md:flex-col items-center gap-4 md:gap-3 flex-1">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                        isCompleted ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' : 'bg-white border-2 border-slate-100 text-slate-300'
                      }`}>
                        <step.icon size={20} />
                      </div>
                      <div className="md:text-center">
                        <p className={`text-xs font-bold uppercase tracking-wider ${isCompleted ? 'text-purple-900' : 'text-slate-400'}`}>
                          {step.name}
                        </p>
                        {isCurrent && <span className="text-[10px] text-purple-600 font-bold animate-pulse">In Progress</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Package className="text-purple-600" size={20} /> Order Items
                </h4>
                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm py-2 border-b border-slate-50 last:border-0">
                      <span className="text-slate-600">{item.name} x {item.quantity}</span>
                      <span className="font-bold">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <MapPin className="text-purple-600" size={20} /> Delivery Address
                </h4>
                <div className="text-sm text-slate-600 space-y-1">
                  <p className="font-bold text-slate-900">{order.customerDetails.fullName}</p>
                  <p>{order.customerDetails.address}</p>
                  <p>{order.customerDetails.city}, {order.customerDetails.state} - {order.customerDetails.pinCode}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {searched && !order && !loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-red-50 rounded-[2rem] border-2 border-dashed border-red-100"
          >
            <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
            <h3 className="text-xl font-bold text-red-900">No Order Found</h3>
            <p className="text-red-600 max-w-xs mx-auto text-sm">We couldn't find an order with these details. Please double-check your Order ID and Mobile Number.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
