import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Star, TrendingUp, Sparkles, Clock } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { motion } from 'framer-motion';
import { Product } from '../types';

const CATEGORIES = [
  { name: 'Fashion & Beauty', id: 'fashion', image: '/src/assets/images/category_fashion_beauty_1793195970715.jpg', items: '2k+ Items' },
  { name: 'Electronics & Gadgets', id: 'electronics', image: '/src/assets/images/category_electronics_1793195970694.jpg', items: '1.5k+ Items' },
  { name: 'Clothing & Shoes', id: 'clothing', image: '/src/assets/images/category_clothing_1793195971307.jpg', items: '3k+ Items' },
];

export default function Home() {
  const { products, loading } = useProducts();

  return (
    <div className="flex flex-col gap-12 pb-20">
      {/* Hero Banner */}
      <section className="relative h-[400px] md:h-[600px] overflow-hidden">
        <img 
          src="/src/assets/images/hero_rm_mart_banner_1793195970079.jpg" 
          alt="Hero Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-xl text-white space-y-6"
            >
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Everything You Need, <span className="text-purple-400">All in One Place.</span>
              </h1>
              <p className="text-lg text-slate-200">
                Shop Fashion, Beauty, Electronics & Lifestyle Products at Amazing Prices!
              </p>
              <div className="flex gap-4">
                <Link to="/category/fashion" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-all flex items-center gap-2">
                  Shop Now <ShoppingBag size={20} />
                </Link>
                <Link to="/offers" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-3 rounded-full font-semibold transition-all">
                  Explore Offers
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="text-purple-600" /> Shop by Category
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => (
            <Link key={cat.id} to={`/category/${cat.id}`} className="group relative h-64 rounded-2xl overflow-hidden shadow-lg">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
                <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">{cat.items}</span>
                <h3 className="text-xl font-bold text-white">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="max-w-7xl mx-auto px-4 w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="text-purple-600" /> Trending Now
          </h2>
          <Link to="/search" className="text-purple-600 font-semibold flex items-center gap-1 hover:underline">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[1,2,3,4,5].map(i => <div key={i} className="aspect-[3/4] bg-slate-100 animate-pulse rounded-2xl" />)}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
            <ShoppingBag size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900">New Arrivals Coming Soon!</h3>
            <p className="text-slate-500 max-w-xs mx-auto">We are adding new products to RM Mart daily. Check back in a bit!</p>
          </div>
        )}
      </section>

      {/* Trust Badges */}
      <section className="bg-purple-50 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-xl shadow-sm text-purple-600"><Star size={24} /></div>
            <div>
              <h4 className="font-bold text-slate-900">Premium Quality</h4>
              <p className="text-xs text-slate-500">Handpicked products</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-xl shadow-sm text-purple-600"><Clock size={24} /></div>
            <div>
              <h4 className="font-bold text-slate-900">Fast Delivery</h4>
              <p className="text-xs text-slate-500">Across India</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-xl shadow-sm text-purple-600"><ShoppingBag size={24} /></div>
            <div>
              <h4 className="font-bold text-slate-900">Secure Payment</h4>
              <p className="text-xs text-slate-500">COD, UPI & Online</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-xl shadow-sm text-purple-600"><Star size={24} /></div>
            <div>
              <h4 className="font-bold text-slate-900">Easy Returns</h4>
              <p className="text-xs text-slate-500">7-Day Return Policy</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/product/${product.id}`} className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all">
      <div className="aspect-[3/4] relative overflow-hidden bg-slate-50">
        <img 
          src={product.images[0] || 'https://via.placeholder.com/300x400?text=Product'} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {product.discount && product.discount > 0 && (
          <span className="absolute top-2 left-2 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {product.discount}% OFF
          </span>
        )}
      </div>
      <div className="p-3 space-y-1">
        <span className="text-[10px] text-slate-400 font-medium uppercase">{product.category}</span>
        <h3 className="text-sm font-semibold text-slate-900 truncate">{product.name}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-purple-600">₹{product.price}</span>
          {product.originalPrice && (
            <span className="text-xs text-slate-400 line-through">₹{product.originalPrice}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
