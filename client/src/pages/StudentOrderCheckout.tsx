import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useLocation } from 'wouter';
import StudentLayout from '@/components/StudentLayout';
import { CreditCard, Smartphone, Building, Loader2, Tag } from 'lucide-react';

interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

const storeItems: StoreItem[] = [
  {
    id: 'course-1',
    name: 'Advanced Mathematics Course',
    description: 'Complete mathematics course with video lectures and practice tests.',
    price: 1999,
    category: 'Course'
  },
  {
    id: 'material-1',
    name: 'Physics Study Materials',
    description: 'Downloadable PDF materials for Class 12 Physics preparation.',
    price: 499,
    category: 'Material'
  },
  {
    id: 'test-1',
    name: 'JEE Mock Test Series',
    description: 'Complete mock test series for JEE Main and Advanced preparation.',
    price: 799,
    category: 'Test Series'
  },
  {
    id: 'session-1',
    name: '1-on-1 Doubt Clearing Session',
    description: 'Personal mentoring session with expert teachers for doubt clearing.',
    price: 299,
    category: 'Session'
  },
  {
    id: 'course-2',
    name: 'Chemistry Masterclass',
    description: 'Intensive chemistry course with practical demonstrations.',
    price: 1599,
    category: 'Course'
  },
  {
    id: 'material-2',
    name: 'English Literature Notes',
    description: 'Comprehensive notes for English literature with analysis.',
    price: 399,
    category: 'Material'
  }
];

export default function StudentOrderCheckout() {
  const [, navigate] = useLocation();
  const [item, setItem] = useState<StoreItem | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    const itemId = path.split('/').pop();
    const foundItem = storeItems.find(i => i.id === itemId);
    if (foundItem) {
      setItem(foundItem);
    } else {
      navigate('/student/store');
    }
  }, [navigate]);

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === 'save10') {
      setDiscount(10);
    } else if (couponCode.toLowerCase() === 'first20') {
      setDiscount(20);
    } else {
      setDiscount(0);
    }
  };

  const handlePayment = async () => {
    if (!item) return;

    setProcessing(true);

    // Mock payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 80% success rate
    const success = Math.random() > 0.2;
    const orderId = `ORD${Date.now()}`;
    const paymentId = `PAY${Math.floor(Math.random() * 100000)}`;

    const finalAmount = item.price - (item.price * discount / 100);

    const order = {
      orderId,
      paymentId,
      itemId: item.id,
      itemName: item.name,
      category: item.category,
      amount: finalAmount,
      originalAmount: item.price,
      discount,
      paymentMethod,
      status: success ? 'Paid' : 'Failed',
      date: new Date().toISOString()
    };

    // Save to localStorage
    const existingOrders = JSON.parse(localStorage.getItem('student_orders') || '[]');
    existingOrders.unshift(order);
    localStorage.setItem('student_orders', JSON.stringify(existingOrders));
    localStorage.setItem('last_order_payment', JSON.stringify(order));

    setProcessing(false);

    // Redirect based on success/failure
    if (success) {
      navigate('/student/order-status?status=success');
    } else {
      navigate('/student/order-status?status=failed');
    }
  };

  if (!item) {
    return (
      <StudentLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      </StudentLayout>
    );
  }

  const finalAmount = item.price - (item.price * discount / 100);

  return (
    <StudentLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">Order Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Item Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Item Price</span>
                    <span>₹{item.price}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({discount}%)</span>
                      <span>-₹{(item.price * discount / 100).toFixed(0)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total Amount</span>
                    <span className="text-purple-600">₹{finalAmount.toFixed(0)}</span>
                  </div>
                </div>

                {/* Coupon Section */}
                <div className="border-t pt-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button onClick={applyCoupon} variant="outline">
                      <Tag className="w-4 h-4 mr-1" />
                      Apply
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Try: SAVE10 or FIRST20</p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === 'UPI' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                    }`}
                    onClick={() => setPaymentMethod('UPI')}
                  >
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-purple-600" />
                      <div>
                        <div className="font-semibold">UPI Payment</div>
                        <div className="text-sm text-gray-600">Pay using Google Pay, PhonePe, Paytm</div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === 'Card' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                    }`}
                    onClick={() => setPaymentMethod('Card')}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-purple-600" />
                      <div>
                        <div className="font-semibold">Credit/Debit Card</div>
                        <div className="text-sm text-gray-600">Visa, Mastercard, RuPay</div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === 'NetBanking' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                    }`}
                    onClick={() => setPaymentMethod('NetBanking')}
                  >
                    <div className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-purple-600" />
                      <div>
                        <div className="font-semibold">Net Banking</div>
                        <div className="text-sm text-gray-600">All major banks supported</div>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={processing}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay ₹${finalAmount.toFixed(0)}`
                  )}
                </Button>

                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/student/store')}
                    className="text-gray-600"
                  >
                    Back to Store
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}