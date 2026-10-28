import React, { useState, useEffect } from 'react';
import { collection, query, limit, onSnapshot, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';

export const useProducts = (cat?: string, l = 10, searchQuery?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = query(collection(db, 'products'), limit(l));
    
    if (cat) {
      q = query(collection(db, 'products'), where('category', '==', cat), limit(l));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let data = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Product));
      
      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        data = data.filter(p => 
          p.name.toLowerCase().includes(lowerQuery) || 
          p.category.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery)
        );
      }

      setProducts(data);
      setLoading(false);
    }, (error) => {
      console.error('Products listener error:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [cat, l, searchQuery]);

  return { products, loading };
};
