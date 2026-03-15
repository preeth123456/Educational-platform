import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';
import StudentLayout from '@/components/StudentLayout';
import { ArrowLeft, Download, FileText, CreditCard, Calendar, Package } from 'lucide-react';

interface Order {
  orderId: string;
  paymentId: string;
  itemId: string;
  itemName: string;
  category: string;
  amount: number;
  originalAmount?: number;
  discount?: number;
  paymentMethod: string;
  status: 'Paid' | 'Failed';
  date: string;
}

export default function StudentOrderDetails() {
  const [, navigate] = useLocation();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const path = window.location.pathname;
    const orderId = path.split('/').pop();
    
    const storedOrders = localStorage.getItem('student_orders');
    if (storedOrders && orderId) {
      const orders: Order[] = JSON.parse(storedOrders);
      const foundOrder = orders.find(o => o.orderId === orderId);
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        navigate('/student/my-orders');
      }
    } else {
      navigate('/student/my-orders');
    }
  }, [navigate]);

  const handleDownloadContent = () => {
    alert('Content download started! Check your downloads folder.');
  };

  const handleDownloadInvoice = () => {
    if (!order) return;
    
    const invoiceContent = `
EDUYATA - ORDER INVOICE
=======================

Order ID: ${order.orderId}
Payment ID: ${order.paymentId}
Date: ${new Date(order.date).toLocaleDateString()}

Item Details:
- Name: ${order.itemName}
- Category: ${order.category}
${order.originalAmount ? `- Original Price: ₹${order.originalAmount}` : ''}
${order.discount ? `- Discount: ${order.discount}%` : ''}
- Final Amount: ₹${order.amount}

Payment Details:
- Method: ${order.paymentMethod}
- Status: ${order.status}

Thank you for choosing EduYata!
    `;
    
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${order.orderId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('Invoice downloaded successfully!');
  };

  if (!order) {
    return (
      <StudentLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      </StudentLayout>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <StudentLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/student/my-orders')}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Orders
            </Button>
            <h1 className="text-3xl font-bold">Order Details</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{order.itemName}</h3>
                    <Badge variant="secondary" className="mt-1">{order.category}</Badge>
                  </div>
                  <Badge variant={order.status === 'Paid' ? 'default' : 'destructive'}>
                    {order.status}
                  </Badge>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-mono">{order.orderId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Order Date:</span>
                    <span>{formatDate(order.date)}</span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="border-t pt-4 space-y-2">
                  {order.originalAmount && (
                    <div className="flex justify-between">
                      <span>Original Price</span>
                      <span>₹{order.originalAmount}</span>
                    </div>
                  )}
                  {order.discount && order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({order.discount}%)</span>
                      <span>-₹{((order.originalAmount || order.amount) * order.discount / 100).toFixed(0)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total Paid</span>
                    <span className="text-purple-600">₹{order.amount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="font-mono">{order.paymentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-semibold">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status:</span>
                    <Badge variant={order.status === 'Paid' ? 'default' : 'destructive'}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction Date:</span>
                    <span>{formatDate(order.date)}</span>
                  </div>
                </div>

                {order.status === 'Paid' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-800">
                      <Calendar className="w-4 h-4" />
                      <span className="font-semibold">Payment Successful</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Your payment has been processed successfully. You can now access your purchased content.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-3 justify-center">
                {order.status === 'Paid' && (
                  <Button
                    onClick={handleDownloadContent}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Content
                  </Button>
                )}
                <Button
                  onClick={handleDownloadInvoice}
                  variant="outline"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Download Invoice
                </Button>
                <Button
                  onClick={() => navigate('/student/my-orders')}
                  variant="outline"
                >
                  Back to My Orders
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </StudentLayout>
  );
}