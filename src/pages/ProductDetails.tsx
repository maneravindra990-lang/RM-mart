import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot, collection, query, where, orderBy, addDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { Product, Review } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Star, ShieldCheck, Truck, RotateCcw, ChevronLeft, Minus, Plus, Camera, Upload, X, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, login } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  
  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    // Real-time Product Listener
    const unsubProduct = onSnapshot(doc(db, 'products', id), (docSnap) => {
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() } as Product;
        setProduct(data);
        if (data.variants?.sizes?.length && !selectedSize) setSelectedSize(data.variants.sizes[0]);
      } else {
        setProduct(null);
      }
      setLoading(false);
    });

    // Real-time Reviews Listener
    const reviewsQuery = query(
      collection(db, 'reviews'),
      where('productId', '==', id),
      orderBy('createdAt', 'desc')
    );
    const unsubReviews = onSnapshot(reviewsQuery, (snapshot) => {
      setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review)));
    });

    return () => {
      unsubProduct();
      unsubReviews();
    };
  }, [id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user) return;
    
    setUploading(true);
    const urls: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const storageRef = ref(storage, `reviews/${Date.now()}_${file.name}`);
      try {
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        urls.push(url);
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    
    setReviewImages(prev => [...prev, ...urls]);
    setUploading(false);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to write a review');
      login();
      return;
    }
    if (!comment.trim()) {
      toast.error('Please add a comment');
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        productId: id,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userPhoto: user.photoURL || '',
        rating,
        comment: comment.trim(),
        images: reviewImages,
        createdAt: Timestamp.now()
      });
      
      toast.success('Review submitted successfully!');
      setComment('');
      setReviewImages([]);
      setRating(5);
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 'New';

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" /></div>;
  if (!product) return <div className="min-h-[60vh] flex flex-col items-center justify-center p-4"> <h2 className="text-2xl font-bold mb-4">Product Not Found</h2> <button onClick={() => navigate('/')} className="text-purple-600 font-bold underline">Go back home</button></div>;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize);
    toast.success('Added to cart!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors">
        <ChevronLeft size={20} /> Back to shop
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-slate-50 border border-slate-100">
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((url, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                <img src={url} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-600 uppercase tracking-widest">
              <span>{product.brand}</span>
              <span>·</span>
              <span>{product.category}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-orange-500">
                <Star size={16} fill="currentColor" />
                <span className="text-sm font-bold text-slate-900">{avgRating}</span>
              </div>
              <span className="text-slate-300">|</span>
              <span className="text-sm text-slate-500">{reviews.length} Reviews</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-purple-600">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-lg text-slate-400 line-through">₹{product.originalPrice}</span>
              )}
            </div>
            {product.discount && (
              <p className="text-sm font-bold text-green-600">Save {product.discount}% OFF today!</p>
            )}
          </div>

          <p className="text-slate-600 leading-relaxed">{product.description}</p>

          {/* Variants */}
          {product.variants?.sizes && (
            <div className="space-y-3">
              <p className="text-sm font-bold text-slate-900">Select Size</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.sizes.map(size => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                      selectedSize === size ? 'border-purple-600 bg-purple-50 text-purple-600' : 'border-slate-100 text-slate-500 hover:border-slate-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <div className="flex items-center justify-between bg-slate-100 rounded-2xl p-1 shrink-0">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-white rounded-xl transition-all"><Minus size={20} /></button>
              <span className="w-12 text-center font-bold text-lg">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-white rounded-xl transition-all"><Plus size={20} /></button>
            </div>
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-purple-100 transition-all active:scale-95"
            >
              <ShoppingCart size={24} /> Add to Cart
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-slate-100">
            <div className="flex flex-col items-center text-center gap-2">
              <ShieldCheck className="text-green-600" size={24} />
              <p className="text-[10px] font-bold text-slate-900 uppercase">100% Original</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <Truck className="text-blue-600" size={24} />
              <p className="text-[10px] font-bold text-slate-900 uppercase">Free Delivery</p>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <RotateCcw className="text-orange-600" size={24} />
              <p className="text-[10px] font-bold text-slate-900 uppercase">7 Day Return</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-slate-100 pt-16">
        {/* Write a Review */}
        <div className="lg:col-span-1 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Customer Reviews</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-orange-500">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={20} fill={Number(avgRating) >= i ? 'currentColor' : 'none'} />
                ))}
              </div>
              <p className="text-sm font-medium text-slate-500">{avgRating} out of 5 ({reviews.length} reviews)</p>
            </div>
          </div>

          <form onSubmit={handleReviewSubmit} className="bg-slate-50 rounded-[2rem] p-6 space-y-6">
            <h3 className="font-bold text-slate-900">Write a Review</h3>
            
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Rating</p>
              <div className="flex gap-2">
                {[1,2,3,4,5].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i)}
                    className={`p-1 transition-all ${rating >= i ? 'text-orange-500' : 'text-slate-300 hover:text-orange-300'}`}
                  >
                    <Star size={32} fill={rating >= i ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Comment</p>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                placeholder="Share your thoughts about this product..."
              />
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Upload Photos</p>
              <div className="grid grid-cols-3 gap-2">
                {reviewImages.map((url, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                    <img src={url} alt="Review" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setReviewImages(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
                <label className="aspect-square rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:border-purple-500 hover:text-purple-500 cursor-pointer transition-all">
                  {uploading ? (
                    <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Camera size={24} />
                      <span className="text-[10px] font-bold mt-1 uppercase">Add</span>
                    </>
                  )}
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Post Review'}
            </button>
          </form>
        </div>

        {/* Review List */}
        <div className="lg:col-span-2 space-y-8">
          {reviews.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100">
              <User size={48} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-500">No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            <div className="space-y-8">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-slate-100 pb-8 last:border-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold overflow-hidden border-2 border-white shadow-sm">
                        {review.userPhoto ? <img src={review.userPhoto} alt="" className="w-full h-full object-cover" /> : review.userName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{review.userName}</h4>
                        <p className="text-[10px] text-slate-400 font-medium">{new Date(review.createdAt?.toDate()).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex text-orange-500">
                      {[1,2,3,4,5].map(i => <Star key={i} size={14} fill={review.rating >= i ? 'currentColor' : 'none'} />)}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{review.comment}</p>
                  {review.images && review.images.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {review.images.map((url, i) => (
                        <img key={i} src={url} alt="Review" className="w-20 h-20 rounded-xl object-cover border border-slate-100 shadow-sm hover:scale-110 transition-transform cursor-pointer" />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
