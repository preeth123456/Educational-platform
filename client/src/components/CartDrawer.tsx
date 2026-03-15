import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';
import { ShoppingCart, Plus, Minus, Trash2, X } from 'lucide-react';
import { getCart, updateCartItemQty, removeFromCart, getCartTotal, getCartItemCount, type CartItem } from '@/utils/storeData';

interface CartDrawerProps {
  onCartUpdate?: () => void;
}

export default function CartDrawer({ onCartUpdate }: CartDrawerProps) {
  const [, navigate] = useLocation();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const loadCart = () => {
    setCart(getCart());
  };

  useEffect(() => {
    loadCart();
    const interval = setInterval(loadCart, 1000); // Refresh cart every second
    return () => clearInterval(interval);
  }, []);

  const handleQtyChange = (id: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemove(id);
      return;
    }
    updateCartItemQty(id, newQty);
    loadCart();
    onCartUpdate?.();
  };

  const handleRemove = (id: number) => {
    removeFromCart(id);
    loadCart();
    onCartUpdate?.();
  };

  const handleCheckout = () => {
    setIsOpen(false);
    navigate('/student/store/checkout');
  };

  const cartItemCount = getCartItemCount();
  const cartTotal = getCartTotal();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <ShoppingCart className="w-4 h-4" />
          {cartItemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {cartItemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Shopping Cart ({cartItemCount})</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Your cart is empty</p>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-600">{item.type}</p>
                    <p className="text-sm font-bold text-purple-600">₹{item.price}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQtyChange(item.id, item.qty - 1)}
                        className="h-6 w-6 p-0"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="text-sm font-semibold w-8 text-center">{item.qty}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQtyChange(item.id, item.qty + 1)}
                        className="h-6 w-6 p-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemove(item.id)}
                      className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">Total:</span>
                  <span className="text-lg font-bold text-purple-600">₹{cartTotal}</span>
                </div>
                
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={cart.length === 0}
                >
                  Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}