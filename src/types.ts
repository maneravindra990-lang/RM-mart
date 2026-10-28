export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  brand: string;
  stock: number;
  images: string[];
  variants?: {
    sizes?: string[];
    colors?: string[];
  };
  rating: number;
  availability: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

export interface Order {
  id: string;
  customerDetails: {
    fullName: string;
    mobile: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
  };
  items: CartItem[];
  totalAmount: number;
  discount: number;
  finalAmount: number;
  paymentMethod: 'COD' | 'UPI' | 'ONLINE';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  orderStatus: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Offer {
  id: string;
  name: string;
  description: string;
  discountPercentage?: number;
  discountAmount?: number;
  startDate: string;
  endDate: string;
  categoryId?: string;
  productId?: string;
  type: string;
  active: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercentage: number;
  minOrderValue: number;
  maxDiscount: number;
  expiryDate: string;
  active: boolean;
}

export interface SiteSettings {
  siteName: string;
  logoUrl: string;
  contactPhone: string;
  ownerEmail: string;
  whatsappNumber: string;
  deliveryCharges: number;
  minOrderAmount: number;
  storeAddress: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  rating: number;
  comment: string;
  images: string[];
  createdAt: any;
}
