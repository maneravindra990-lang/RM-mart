import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { SiteSettings } from '../types';
import AdminLayout from '../components/AdminLayout';
import { Save, Globe, Mail, Phone, MapPin, Truck, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'RM Mart',
    logoUrl: '/src/assets/images/rm_mart_logo_1793195970414.jpg',
    contactPhone: '+91 98765 43210',
    ownerEmail: 'maneravindra990@gmail.com',
    whatsappNumber: '+91 98765 43210',
    deliveryCharges: 40,
    minOrderAmount: 500,
    storeAddress: '123 Shopping Plaza, New Delhi, India 110001',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data() as SiteSettings);
      }
      setLoading(false);
    }, (error) => {
      console.error('Settings listener error:', error);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'settings', 'global'), settings);
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Website Settings</h1>
          <p className="text-slate-500 text-sm">Customize your store's identity and general policies</p>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* General Info */}
          <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Globe className="text-purple-600" size={20} /> Store Identity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Store Name</label>
                <input 
                  type="text" 
                  value={settings.siteName}
                  onChange={e => setSettings({...settings, siteName: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Logo URL</label>
                <input 
                  type="text" 
                  value={settings.logoUrl}
                  onChange={e => setSettings({...settings, logoUrl: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Phone className="text-purple-600" size={20} /> Contact Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Support Email</label>
                <input 
                  type="email" 
                  value={settings.ownerEmail}
                  onChange={e => setSettings({...settings, ownerEmail: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Support Phone</label>
                <input 
                  type="text" 
                  value={settings.contactPhone}
                  onChange={e => setSettings({...settings, contactPhone: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Store Address</label>
                <textarea 
                  rows={2}
                  value={settings.storeAddress}
                  onChange={e => setSettings({...settings, storeAddress: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Logistics */}
          <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Truck className="text-purple-600" size={20} /> Shipping & Delivery
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Delivery Charges (₹)</label>
                <input 
                  type="number" 
                  value={settings.deliveryCharges}
                  onChange={e => setSettings({...settings, deliveryCharges: Number(e.target.value)})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Free Delivery Above (₹)</label>
                <input 
                  type="number" 
                  value={settings.minOrderAmount}
                  onChange={e => setSettings({...settings, minOrderAmount: Number(e.target.value)})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-4 rounded-2xl font-bold shadow-xl shadow-purple-200 transition-all flex items-center gap-3 active:scale-95"
            >
              <Save size={20} /> Save All Settings
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
