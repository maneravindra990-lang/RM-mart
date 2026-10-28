import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
  const { isAdmin } = useAuth();
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand Info */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">RM Mart</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Everything You Need, All in One Place. We provide high-quality fashion, electronics, and lifestyle products at unbeatable prices across India.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-purple-600 transition-colors"><Globe size={18} /></a>
            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-purple-600 transition-colors"><Globe size={18} /></a>
            <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-purple-600 transition-colors"><Globe size={18} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <ul className="space-y-2 text-slate-400 text-sm">
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/offers" className="hover:text-white transition-colors">Special Offers</Link></li>
            <li><Link to="/track-order" className="hover:text-white transition-colors">Track Your Order</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            {isAdmin && <li><Link to="/owner-admin" className="text-purple-400 font-bold hover:text-purple-300 transition-colors">Admin Dashboard</Link></li>}
            <li>
              <button 
                onClick={async () => {
                  try {
                    const { auth } = await import('../firebase');
                    await auth.signOut();
                    window.location.href = '/';
                  } catch (e) {
                    console.error(e);
                  }
                }}
                className="hover:text-red-400 transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </li>
          </ul>
        </div>

        {/* Policies */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Our Policies</h3>
          <ul className="space-y-2 text-slate-400 text-sm">
            <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            <li><Link to="/refund" className="hover:text-white transition-colors">Return & Refund</Link></li>
            <li><Link to="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contact Us</h3>
          <ul className="space-y-3 text-slate-400 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="shrink-0 text-purple-500" />
              <span>123 Shopping Plaza, New Delhi, India 110001</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="shrink-0 text-purple-500" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="shrink-0 text-purple-500" />
              <span>support@rmmart.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
        <p>© 2026 RM Mart. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span>We Accept:</span>
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" alt="UPI" className="h-4 grayscale hover:grayscale-0 transition-all" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-4 grayscale hover:grayscale-0 transition-all" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-2 grayscale hover:grayscale-0 transition-all" />
        </div>
      </div>
    </footer>
  );
}
