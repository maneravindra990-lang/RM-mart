import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, ArrowLeft, SlidersHorizontal } from 'lucide-react';

export default function Category() {
  const { cat } = useParams<{ cat: string }>();
  const { products, loading } = useProducts(cat, 50);

  const decodedCategory = cat ? decodeURIComponent(cat) : '';

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs & Header */}
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-purple-600 mb-4 transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 capitalize mb-2">{decodedCategory}</h1>
            <p className="text-slate-500">Discover the best {decodedCategory} products at RM Mart.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors">
              <SlidersHorizontal size={16} /> Filter
            </button>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{products.length} Items</p>
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
          <ShoppingBag size={48} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-900">No products found</h2>
          <p className="text-slate-500">We couldn't find any products in this category yet.</p>
          <Link to="/" className="inline-block mt-6 bg-purple-600 text-white px-8 py-3 rounded-full font-bold">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2rem] border border-slate-100 p-3 hover:shadow-xl hover:shadow-purple-100/50 transition-all group"
            >
              <Link to={`/product/${product.id}`}>
                <div className="aspect-square rounded-[1.5rem] overflow-hidden bg-slate-50 mb-4 relative">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </div>
                  )}
                </div>
                <div className="px-1">
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center bg-green-50 px-1.5 py-0.5 rounded text-[10px] font-bold text-green-700">
                      <Star size={10} className="fill-green-700 mr-0.5" />
                      {product.rating || '4.5'}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">(4.5)</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1 truncate line-clamp-1">{product.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-purple-600">₹{product.price}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-xs text-slate-400 line-through">₹{product.originalPrice}</span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
