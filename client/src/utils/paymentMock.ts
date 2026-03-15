export interface Plan {
  planId: string;
  planName: string;
  price: number;
  currency: string;
  billing: 'monthly' | 'yearly';
}

export interface PaymentResult {
  paymentId: string;
  status: 'success' | 'failed';
  amount: number;
  planId: string;
  createdAt: string;
  method: string;
}

export interface Invoice {
  id: string;
  planName: string;
  amount: number;
  status: 'Paid' | 'Failed';
  date: string;
  paymentId: string;
  method: string;
}

export const mockPayment = async (plan: Plan, method: string): Promise<PaymentResult> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // 80% success rate
  const isSuccess = Math.random() > 0.2;
  
  const paymentId = `PAY${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const gstAmount = Math.round(plan.price * 0.18);
  const totalAmount = plan.price + gstAmount;
  
  const result: PaymentResult = {
    paymentId,
    status: isSuccess ? 'success' : 'failed',
    amount: totalAmount,
    planId: plan.planId,
    createdAt: new Date().toISOString(),
    method
  };
  
  // Store in localStorage
  localStorage.setItem('last_payment', JSON.stringify(result));
  
  if (isSuccess) {
    // Add to invoices
    const invoice: Invoice = {
      id: `INV-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      planName: plan.planName,
      amount: totalAmount,
      status: 'Paid',
      date: new Date().toLocaleDateString('en-IN'),
      paymentId,
      method
    };
    
    const existingInvoices = JSON.parse(localStorage.getItem('student_invoices') || '[]');
    existingInvoices.unshift(invoice);
    localStorage.setItem('student_invoices', JSON.stringify(existingInvoices));
  }
  
  return result;
};

export const getPlans = () => [
  {
    planId: 'basic',
    planName: 'Basic',
    price: 199,
    currency: 'INR',
    billing: 'monthly' as const,
    features: [
      'Access to basic courses',
      'Standard video quality',
      'Community support',
      'Mobile app access',
      'Basic progress tracking',
      'Email notifications'
    ],
    badge: null
  },
  {
    planId: 'pro',
    planName: 'Pro',
    price: 499,
    currency: 'INR',
    billing: 'monthly' as const,
    features: [
      'Access to all courses',
      'HD video quality',
      'Priority support',
      'Offline downloads',
      'Advanced analytics',
      'Live sessions access'
    ],
    badge: 'Most Popular'
  },
  {
    planId: 'premium',
    planName: 'Premium',
    price: 999,
    currency: 'INR',
    billing: 'monthly' as const,
    features: [
      'Everything in Pro',
      '4K video quality',
      '1-on-1 mentoring',
      'Custom learning paths',
      'Certificate programs',
      'API access'
    ],
    badge: 'Best Value'
  }
];