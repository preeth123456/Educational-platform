import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';
import StudentLayout from '@/components/StudentLayout';
import { ShoppingBag, Eye, Calendar, RefreshCw, Wallet } from 'lucide-react';
import { getOrders, updateOrderStatus, type Order } from '@/utils/storeData';
import { walletService } from '@/utils/walletService';

export default function OrdersPage() {
  const [, navigate] = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  const handleViewDetails = (orderId: string) => {
    const order = orders.find(o => o.orderId === orderId);
    if (order) {
      const itemsList = order.items.map(item => `${item.name} (${item.qty}x)`).join(', ');
      const walletInfo = (order as any).walletUsed ? `\nWallet Used: ₹${(order as any).walletUsed}\nPaid Online: ₹${(order as any).amountPaidOnline || 0}` : '';
      alert(`Order: ${orderId}\nItems: ${itemsList}\nTotal: ₹${order.total}${walletInfo}\nPayment: ${order.paymentMethod}\nStatus: ${order.status}`);
    }
  };

  const handleRefund = (orderId: string) => {
    const order = orders.find(o => o.orderId === orderId);
    if (order && order.status === 'PAID') {
      // Update order status to REFUNDED
      updateOrderStatus(orderId, 'REFUNDED');
      
      // Credit wallet with refund amount
      walletService.creditWallet(order.total, 'REFUND', `Refund for order ${orderId}`);
      
      // Refresh orders
      setOrders(getOrders());
      
      alert('Refund credited to wallet successfully!');
    }
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
                        <th className="text-left py-3 px-2 font-semibold text-gray-700">Date</th>
                        <th className="text-right py-3 px-2 font-semibold text-gray-700">Total</th>
                        <th className="text-center py-3 px-2 font-semibold text-gray-700">Payment</th>
                        <th className="text-center py-3 px-2 font-semibold text-gray-700">Status</th>
                        <th className="text-center py-3 px-2 font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.orderId} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-2 font-mono text-sm">{order.orderId}</td>
                          <td className="py-3 px-2 text-gray-600">{new Date(order.date).toLocaleDateString()}</td>
                          <td className="py-3 px-2 text-right">
                            <div className="font-semibold">₹{order.total}</div>
                            {(order as any).walletUsed > 0 && (
                              <div className="text-xs text-green-600 flex items-center justify-end gap-1">
                                <Wallet className="w-3 h-3" />
                                ₹{(order as any).walletUsed}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-2 text-center text-sm">{order.paymentMethod}</td>
                          <td className="py-3 px-2 text-center">
                            <Badge variant={order.status === 'PAID' ? 'default' : order.status === 'REFUNDED' ? 'secondary' : 'destructive'}>
                              {order.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <div className="flex gap-1 justify-center">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewDetails(order.orderId)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              {order.status === 'PAID' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRefund(order.orderId)}
                                  className="text-orange-600 border-orange-600 hover:bg-orange-50"
                                >
                                  <RefreshCw className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
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
                      <h3 className="font-semibold text-lg">Order #{order.orderId}</h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                    </div>
                    <Badge variant={order.status === 'PAID' ? 'default' : order.status === 'REFUNDED' ? 'secondary' : 'destructive'}>
                      {order.status}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xl font-bold text-purple-600">₹{order.total}</span>
                      {(order as any).walletUsed > 0 && (
                        <div className="text-sm text-green-600 flex items-center gap-1">
                          <Wallet className="w-4 h-4" />
                          Wallet: ₹{(order as any).walletUsed}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewDetails(order.orderId)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {order.status === 'PAID' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRefund(order.orderId)}
                          className="text-orange-600 border-orange-600 hover:bg-orange-50"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
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