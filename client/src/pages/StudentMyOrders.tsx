import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';
import StudentLayout from '@/components/StudentLayout';
import { ShoppingBag, Eye, Calendar, CreditCard } from 'lucide-react';

interface Order {
  orderId: string;
  paymentId: string;
  itemId: string;
  itemName: string;
  category: string;
  amount: number;
  status: 'Paid' | 'Failed';
  date: string;
}

export default function StudentMyOrders() {
  const [, navigate] = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const storedOrders = localStorage.getItem('student_orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  const handleViewOrder = (orderId: string) => {
    navigate(`/student/order/${orderId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (orders.length === 0) {
    return (
      <StudentLayout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-3xl font-bold text-center mb-8">My Orders</h1>
            
            <Card className="text-center py-12">
              <CardContent>
                <ShoppingBag className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping to see your orders here.</p>
                <Button
                  onClick={() => navigate('/student/store')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Go to Store
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">My Orders</h1>

          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 font-semibold text-gray-700">Order ID</th>
                        <th className="text-left py-3 px-2 font-semibold text-gray-700">Item Name</th>
                        <th className="text-left py-3 px-2 font-semibold text-gray-700">Category</th>
                        <th className="text-right py-3 px-2 font-semibold text-gray-700">Amount</th>
                        <th className="text-center py-3 px-2 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-2 font-semibold text-gray-700">Date</th>
                        <th className="text-center py-3 px-2 font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.orderId} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-2 font-mono text-sm">{order.orderId}</td>
                          <td className="py-3 px-2 font-medium">{order.itemName}</td>
                          <td className="py-3 px-2">
                            <Badge variant="secondary">{order.category}</Badge>
                          </td>
                          <td className="py-3 px-2 text-right font-semibold">₹{order.amount}</td>
                          <td className="py-3 px-2 text-center">
                            <Badge variant={order.status === 'Paid' ? 'default' : 'destructive'}>
                              {order.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-2 text-gray-600">{formatDate(order.date)}</td>
                          <td className="py-3 px-2 text-center">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewOrder(order.orderId)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {orders.map((order) => (
              <Card key={order.orderId}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{order.itemName}</h3>
                      <p className="text-sm text-gray-600 font-mono">{order.orderId}</p>
                    </div>
                    <Badge variant={order.status === 'Paid' ? 'default' : 'destructive'}>
                      {order.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Badge variant="secondary">{order.category}</Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(order.date)}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-purple-600">₹{order.amount}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewOrder(order.orderId)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button
              onClick={() => navigate('/student/store')}
              variant="outline"
              className="text-purple-600 border-purple-600 hover:bg-purple-50"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}