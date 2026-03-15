import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLocation } from 'wouter';
import StudentLayout from '@/components/StudentLayout';
import { CheckCircle, ShoppingBag, FileText, Wallet } from 'lucide-react';
import { getOrders } from '@/utils/storeData';

export default function PaymentStatusPage() {
  const [, navigate] = useLocation();
  const [orderId, setOrderId] = useState<string>('');
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderIdParam = urlParams.get('orderId');
    if (orderIdParam) {
      setOrderId(orderIdParam);
      // Get order details
      const orders = getOrders();
      const order = orders.find(o => o.orderId === orderIdParam);
      setOrderDetails(order);
    }
  }, []);

  return (
    <StudentLayout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
        <div className="max-w-md w-full mx-4">
          <Card className="text-center shadow-lg">
            <CardContent className="p-8">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
              <p className="text-gray-600 mb-6">Your order has been placed successfully.</p>
              
              {orderId && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
                  <div>
                    <div className="text-sm text-gray-600">Order ID</div>
                    <div className="font-mono font-semibold">{orderId}</div>
                  </div>
                  {orderDetails && (
                    <>
                      <div>
                        <div className="text-sm text-gray-600">Total Amount</div>
                        <div className="font-semibold">₹{orderDetails.total}</div>
                      </div>
                      {orderDetails.walletUsed > 0 && (
                        <div className="flex items-center gap-2 text-green-600">
                          <Wallet className="w-4 h-4" />
                          <span className="text-sm">Wallet Used: ₹{orderDetails.walletUsed}</span>
                        </div>
                      )}
                      {orderDetails.amountPaidOnline > 0 && (
                        <div>
                          <div className="text-sm text-gray-600">Paid Online</div>
                          <div className="font-semibold">₹{orderDetails.amountPaidOnline}</div>
                        </div>
                      )}
                      <div>
                        <div className="text-sm text-gray-600">Payment Method</div>
                        <div className="font-semibold">{orderDetails.paymentMethod}</div>
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/student/orders')}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View Orders
                </Button>
                <Button
                  onClick={() => navigate('/student/store')}
                  variant="outline"
                  className="w-full"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Back to Store
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </StudentLayout>
  );
}