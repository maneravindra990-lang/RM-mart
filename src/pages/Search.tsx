import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Star, ShoppingBag, ArrowLeft, X } from 'lucide-react';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const { products, loading } = useProducts(undefined, 100, queryParam);
  const [searchInput, setSearchInput] = useState(queryParam);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchParams({});
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-12">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-purple-600 mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">
            {queryParam ? `Search results for "${queryParam}"` : 'Search Products'}
          </h1>
          
          <form onSubmit={handleSearch} className="relative group">
            <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-600 transition-colors" size={20} />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for fashion, electronics, lifestyle..."
              className="w-full bg-white border-2 border-slate-100 focus:border-purple-600 rounded-[2rem] py-5 pl-14 pr-14 outline-none text-slate-900 font-medium transition-all shadow-sm"
            />
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            )}
          </form>
        </div>
      </div>

      {queryParam && products.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <SearchIcon size={32} className="text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">No results found</h2>
          <p className="text-slate-500 max-w-md mx-auto mt-2">
            We couldn't find any products matching "{queryParam}". Try checking for typos or using more general terms.
          </p>
        </div>
      ) : queryParam ? (
        <div>
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              Found {products.length} Items
            </p>
          </div>
          
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
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-8 bg-purple-50 rounded-[2.5rem] border border-purple-100">
            <h3 className="text-xl font-bold text-purple-900 mb-4">Popular Searches</h3>
            <div className="flex flex-wrap gap-2">
              {['Smart Watches', 'Bluetooth Earphones', 'Facewash', 'Jeans', 'Moisturizer', 'T-Shirts'].map(term => (
                <button
                  key={term}
                  onClick={() => setSearchParams({ q: term })}
                  className="bg-white px-4 py-2 rounded-xl text-sm font-semibold text-purple-700 hover:bg-purple-100 transition-colors shadow-sm"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100">
            <h3 className="text-xl font-bold text-blue-900 mb-4">Top Categories</h3>
            <div className="flex flex-wrap gap-2">
              {['Electronics', 'Fashion', 'Beauty', 'Home'].map(cat => (
                <Link
                  key={cat}
                  to={`/category/${cat.toLowerCase()}`}
                  className="bg-white px-4 py-2 rounded-xl text-sm font-semibold text-blue-700 hover:bg-blue-100 transition-colors shadow-sm"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
