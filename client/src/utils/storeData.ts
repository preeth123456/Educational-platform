export interface Product {
  id: number;
  name: string;
  type: 'Course' | 'Material' | 'Test Series' | 'Session';
  price: number;
  description: string;
  features: string[];
}

export interface CartItem {
  id: number;
  name: string;
  type: string;
  price: number;
  qty: number;
}

export interface Order {
  orderId: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'PAID' | 'PENDING' | 'FAILED' | 'REFUNDED';
  paymentMethod: string;
  walletUsed?: number;
  amountPaidOnline?: number;
}

export const storeProducts: Product[] = [
  {
    id: 1,
    name: 'NEET Test Series',
    type: 'Test Series',
    price: 499,
    description: 'Complete NEET mock test series with detailed solutions and performance analysis.',
    features: ['20 Full Length Tests', 'Detailed Solutions', 'Performance Analytics', 'All India Rank']
  },
  {
    id: 2,
    name: 'JEE Advanced Course',
    type: 'Course',
    price: 1999,
    description: 'Comprehensive JEE Advanced preparation course with video lectures and practice problems.',
    features: ['100+ Video Lectures', 'Practice Problems', 'Doubt Support', '1 Year Access']
  },
  {
    id: 3,
    name: 'Physics Study Material',
    type: 'Material',
    price: 299,
    description: 'High-quality physics study materials with formulas, concepts, and solved examples.',
    features: ['PDF Materials', 'Formula Sheets', 'Solved Examples', 'Quick Revision Notes']
  },
  {
    id: 4,
    name: '1-on-1 Mentoring Session',
    type: 'Session',
    price: 799,
    description: 'Personal mentoring session with expert teachers for career guidance and doubt clearing.',
    features: ['60 Min Session', 'Expert Mentor', 'Career Guidance', 'Doubt Clearing']
  }
];

// Cart utilities
export const getCart = (): CartItem[] => {
  const cart = localStorage.getItem('student_cart');
  return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart: CartItem[]): void => {
  localStorage.setItem('student_cart', JSON.stringify(cart));
};

export const addToCart = (product: Product): void => {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      type: product.type,
      price: product.price,
      qty: 1
    });
  }
  
  saveCart(cart);
};

export const updateCartItemQty = (id: number, qty: number): void => {
  const cart = getCart();
  const item = cart.find(item => item.id === id);
  if (item) {
    item.qty = qty;
    saveCart(cart);
  }
};

export const removeFromCart = (id: number): void => {
  const cart = getCart().filter(item => item.id !== id);
  saveCart(cart);
};

export const clearCart = (): void => {
  localStorage.removeItem('student_cart');
};

export const getCartTotal = (): number => {
  return getCart().reduce((total, item) => total + (item.price * item.qty), 0);
};

export const getCartItemCount = (): number => {
  return getCart().reduce((count, item) => count + item.qty, 0);
};

// Orders utilities
export const getOrders = (): Order[] => {
  const orders = localStorage.getItem('student_orders');
  return orders ? JSON.parse(orders) : [];
};

export const saveOrder = (order: Order): void => {
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem('student_orders', JSON.stringify(orders));
};

export const generateOrderId = (): string => {
  return `ORD${Date.now()}`;
};

export const updateOrderStatus = (orderId: string, status: Order['status']): void => {
  const orders = getOrders();
  const order = orders.find(o => o.orderId === orderId);
  if (order) {
    order.status = status;
    localStorage.setItem('student_orders', JSON.stringify(orders));
  }
};