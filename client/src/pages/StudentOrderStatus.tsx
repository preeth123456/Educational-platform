import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLocation } from 'wouter';
import StudentLayout from '@/components/StudentLayout';
import { CheckCircle, XCircle, ShoppingBag, RotateCcw } from 'lucide-react';

interface OrderData {
  orderId: string;
  paymentId: string;
  itemName: string;
  amount: number;
  status: string;
}

export default function StudentOrderStatus() {
  const [, navigate] = useLocation();
  const [status, setStatus] = useState<'success' | 'failed' | null>(null);
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    // Get status from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const statusParam = urlParams.get('status') as 'success' | 'failed';
    setStatus(statusParam);

    // Get last order data from localStorage
    const lastOrder = localStorage.getItem('last_order_payment');
    if (lastOrder) {
      setOrderData(JSON.parse(lastOrder));
    }
  }, []);

  const handleRetryPayment = () => {
    if (orderData) {
      // Find the item ID from the order data
      const orders = JSON.parse(localStorage.getItem('student_orders') || '[]');
      const order = orders.find((o: any) => o.orderId === orderData.orderId);
      if (order) {
        navigate(`/student/order-checkout/${order.itemId}`);
      }
    }
  };

  if (!status) {
    return (
      <StudentLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
        <div className="max-w-md w-full mx-4">
          <Card className="text-center shadow-lg">
            <CardContent className="p-8">
              {status === 'success' ? (
                <>
                  <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                  <p className="text-gray-600 mb-6">Your order has been placed successfully.</p>
                  
                  {orderData && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order ID:</span>
                          <span className="font-mono">{orderData.orderId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment ID:</span>
                          <span className="font-mono">{orderData.paymentId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Item:</span>
                          <span className="font-semibold">{orderData.itemName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-bold text-green-600">₹{orderData.amount}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Button
                      onClick={() => navigate('/dashboard')}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      Go to Dashboard
                    </Button>
                    <Button
                      onClick={() => navigate('/student/my-orders')}
                      variant="outline"
                      className="w-full"
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      View My Orders
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
                  <p className="text-gray-600 mb-6">There was an issue processing your payment. Please try again.</p>

                  <div className="space-y-3">
                    <Button
                      onClick={handleRetryPayment}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Retry Payment
                    </Button>
                    <Button
                      onClick={() => navigate('/student/store')}
                      variant="outline"
                      className="w-full"
                    >
                      Back to Store
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </StudentLayout>
  );
}