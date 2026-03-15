import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocation } from 'wouter';
import StudentLayout from '@/components/StudentLayout';
import { ArrowLeft, CreditCard, Wallet } from 'lucide-react';
import { getCart, clearCart, saveOrder, generateOrderId, getCartTotal, type CartItem } from '@/utils/storeData';
import { walletService } from '@/utils/walletService';

export default function CheckoutPage() {
  const [, navigate] = useLocation();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [processing, setProcessing] = useState(false);
  const [useWallet, setUseWallet] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    const cartItems = getCart();
    if (cartItems.length === 0) {
      navigate('/student/store');
      return;
    }
    setCart(cartItems);
    setWalletBalance(walletService.getWalletBalance().balance);
  }, [navigate]);

  const total = getCartTotal();
  const walletUsed = useWallet ? Math.min(walletBalance, total) : 0;
  const remainingPayable = total - walletUsed;

  const handlePlaceOrder = async () => {
    setProcessing(true);
    
    // Handle wallet deduction if used
    if (useWallet && walletUsed > 0) {
      walletService.debitWallet(walletUsed, `Paid for order items`);
    }
    
    // Mock payment processing delay for remaining amount
    if (remainingPayable > 0) {
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    const orderId = generateOrderId();
    const order = {
      orderId,
      date: new Date().toISOString().split('T')[0],
      items: cart,
      total,
      status: 'PAID' as const,
      paymentMethod: remainingPayable === 0 ? 'WALLET' : `WALLET+${paymentMethod}`,
      walletUsed,
      amountPaidOnline: remainingPayable
    };
    
    saveOrder(order);
    clearCart();
    
    navigate('/student/store/payment-status?orderId=' + orderId);
  };

  if (cart.length === 0) {
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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/student/store')}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Store
            </Button>
            <h1 className="text-3xl font-bold">Checkout</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.type}</p>
                        <p className="text-sm">Qty: {item.qty}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{item.price * item.qty}</p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span>Subtotal</span>
                      <span>₹{total}</span>
                    </div>
                    {useWallet && walletUsed > 0 && (
                      <div className="flex justify-between items-center text-green-600">
                        <span>Wallet Used</span>
                        <span>-₹{walletUsed}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>Amount to Pay</span>
                      <span className="text-purple-600">₹{remainingPayable}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Wallet Option */}
                {walletBalance > 0 && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-purple-600" />
                        <span className="font-semibold">Use Wallet Balance</span>
                      </div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={useWallet}
                          onChange={(e) => setUseWallet(e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm">Available: ₹{walletBalance}</span>
                      </label>
                    </div>
                    {useWallet && (
                      <div className="text-sm text-purple-700">
                        Will use ₹{walletUsed} from wallet
                      </div>
                    )}
                  </div>
                )}

                {remainingPayable > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Choose Payment Method</label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UPI">UPI (Google Pay, PhonePe, Paytm)</SelectItem>
                        <SelectItem value="Card">Credit/Debit Card</SelectItem>
                        <SelectItem value="Netbanking">Net Banking</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">
                    {remainingPayable === 0 ? 'Paid via Wallet' : 'Amount to Pay'}
                  </h4>
                  <p className="text-2xl font-bold text-purple-600">₹{remainingPayable}</p>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={processing}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg"
                >
                  {processing ? 'Processing...' : remainingPayable === 0 ? 'Pay via Wallet' : 'Place Order'}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By placing this order, you agree to our terms and conditions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}