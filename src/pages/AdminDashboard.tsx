import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import AdminLayout from '../components/AdminLayout';
import { TrendingUp, ShoppingBag, Users, IndianRupee, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Order } from '../types';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const orders = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Order));
      
      const totalSales = orders.reduce((sum: number, o: Order) => sum + (o.finalAmount || 0), 0);
      const pending = orders.filter((o: Order) => o.orderStatus === 'PENDING').length;
      
      const uniqueEmails = new Set(orders.map((o: Order) => o.customerDetails.email));

      setStats({
        totalSales,
        totalOrders: orders.length,
        totalCustomers: uniqueEmails.size,
        pendingOrders: pending,
      });

      setRecentOrders(orders.slice(0, 5));
      setLoading(false);
    }, (error) => {
      console.error('Dashboard listener error:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const statCards = [
    { name: 'Total Sales', value: `₹${stats.totalSales}`, icon: IndianRupee, color: 'bg-green-50 text-green-600' },
    { name: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'bg-blue-50 text-blue-600' },
    { name: 'Total Customers', value: stats.totalCustomers, icon: Users, color: 'bg-purple-50 text-purple-600' },
    { name: 'Pending Orders', value: stats.pendingOrders, icon: Clock, color: 'bg-orange-50 text-orange-600' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm">Welcome back! Here's what's happening with RM Mart today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.name}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-xl`}>
                <stat.icon size={24} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Recent Orders</h3>
              <button className="text-purple-600 text-sm font-semibold hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Order ID</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.length > 0 ? recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-xs font-mono text-slate-500">#{order.id.slice(0, 8)}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-slate-900">{order.customerDetails.fullName}</p>
                        <p className="text-[10px] text-slate-500">{order.customerDetails.mobile}</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">₹{order.finalAmount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                          order.orderStatus === 'DELIVERED' ? 'bg-green-50 text-green-600' :
                          order.orderStatus === 'CANCELLED' ? 'bg-red-50 text-red-600' :
                          'bg-orange-50 text-orange-600'
                        }`}>
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic text-sm">No recent orders yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions / Store Status */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Store Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-green-600" size={20} />
                    <span className="text-sm font-medium text-green-900">Store is Online</span>
                  </div>
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="text-blue-600" size={20} />
                    <span className="text-sm font-medium text-blue-900">Today's Traffic: 1.2k</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-2xl shadow-sm text-white">
              <h3 className="font-bold mb-2">Need Help?</h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Check our documentation or contact support for advanced store management tips.
              </p>
              <button className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-xl text-sm font-bold transition-all">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
