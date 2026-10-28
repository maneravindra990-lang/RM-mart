import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, updateDoc, doc, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Order } from '../types';
import AdminLayout from '../components/AdminLayout';
import { ShoppingBag, Search, Eye, CheckCircle, Truck, X, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Order));
      setOrders(data);
      setLoading(false);
    }, (error) => {
      console.error('Orders listener error:', error);
      toast.error('Failed to sync orders');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { 
        orderStatus: newStatus,
        updatedAt: Timestamp.now()
      });
      toast.success(`Order status updated to ${newStatus}`);
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, orderStatus: newStatus as any } : null);
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    o.customerDetails.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customerDetails.mobile.includes(searchQuery)
  );

  const statusColors: Record<string, string> = {
    'PENDING': 'bg-orange-50 text-orange-600',
    'CONFIRMED': 'bg-blue-50 text-blue-600',
    'PROCESSING': 'bg-purple-50 text-purple-600',
    'SHIPPED': 'bg-indigo-50 text-indigo-600',
    'OUT_FOR_DELIVERY': 'bg-cyan-50 text-cyan-600',
    'DELIVERED': 'bg-green-50 text-green-600',
    'CANCELLED': 'bg-red-50 text-red-600',
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Order Management</h1>
          <p className="text-slate-500 text-sm">Track and fulfill your customer orders</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3">
          <Search className="text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by Order ID, Name or Mobile..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-none focus:ring-0 text-sm"
          />
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Order Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  [1,2,3].map(i => <tr key={i} className="animate-pulse h-20 bg-slate-50/50"><td></td><td></td><td></td><td></td><td></td></tr>)
                ) : filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">#{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-[10px] text-slate-500">{new Date(order.createdAt as any).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-900">{order.customerDetails.fullName}</p>
                      <p className="text-[10px] text-slate-500">{order.customerDetails.mobile}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">₹{order.finalAmount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[order.orderStatus]}`}>
                        {order.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Order Details #{selectedOrder.id.slice(0, 8)}</h2>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Items */}
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <ShoppingBag className="text-purple-600" size={16} /> Items Ordered
                  </h3>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <div>
                          <p className="font-semibold text-slate-900">{item.name}</p>
                          <p className="text-xs text-slate-500">Qty: {item.quantity} {item.selectedSize ? `· Size: ${item.selectedSize}` : ''}</p>
                        </div>
                        <p className="font-bold text-slate-900">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                    <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                      <span className="font-bold text-slate-900">Total</span>
                      <span className="text-lg font-black text-purple-600">₹{selectedOrder.finalAmount}</span>
                    </div>
                  </div>
                </div>

                {/* Customer & Shipping */}
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <Truck className="text-purple-600" size={16} /> Delivery Information
                  </h3>
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
                    <div className="flex gap-3">
                      <Mail className="text-slate-400" size={18} />
                      <p className="text-sm">{selectedOrder.customerDetails.email}</p>
                    </div>
                    <div className="flex gap-3">
                      <Phone className="text-slate-400" size={18} />
                      <p className="text-sm font-bold">{selectedOrder.customerDetails.mobile}</p>
                    </div>
                    <div className="flex gap-3">
                      <MapPin className="text-slate-400" size={18} />
                      <div className="text-sm">
                        <p className="font-bold">{selectedOrder.customerDetails.fullName}</p>
                        <p className="text-slate-600">{selectedOrder.customerDetails.address}</p>
                        <p className="text-slate-600">{selectedOrder.customerDetails.city}, {selectedOrder.customerDetails.state} - {selectedOrder.customerDetails.pinCode}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Management */}
              <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-4">
                <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider">
                  <CheckCircle size={16} /> Update Order Status
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].map(status => (
                    <button
                      key={status}
                      onClick={() => updateStatus(selectedOrder.id, status)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedOrder.orderStatus === status 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      {status.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
}
