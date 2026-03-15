import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';
import { Check, ShoppingCart } from 'lucide-react';
import { addToCart, type Product } from '@/utils/storeData';

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onCartUpdate?: () => void;
}

export default function ProductDetailsModal({ 
  product, 
  isOpen, 
  onClose, 
  onCartUpdate 
}: ProductDetailsModalProps) {
  const [, navigate] = useLocation();

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product);
    onCartUpdate?.();
    onClose();
  };

  const handleBuyNow = () => {
    addToCart(product);
    onClose();
    navigate('/student/store/checkout');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Badge variant="secondary" className="w-fit">
            {product.type}
          </Badge>
          
          <p className="text-gray-700 text-sm leading-relaxed">
            {product.description}
          </p>
          
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="space-y-1">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t">
            <span className="text-2xl font-bold text-purple-600">₹{product.price}</span>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleAddToCart}
              variant="outline"
              className="flex-1"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
            <Button
              onClick={handleBuyNow}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}