import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StudentLayout from '@/components/StudentLayout';
import { Coupon, sampleCoupons } from '@/utils/promoMockData';
import { Percent, Gift, Calendar, Users } from 'lucide-react';

export default function StudentCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string>('');
  const [couponCode, setCouponCode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setCoupons(sampleCoupons.filter(c => c.isActive));
    const stored = localStorage.getItem('applied_coupon');
    if (stored) setAppliedCoupon(stored);
  }, []);

  const applyCoupon = (code: string) => {
    const coupon = coupons.find(c => c.code === code);
    if (coupon) {
      localStorage.setItem('applied_coupon', code);
      setAppliedCoupon(code);
      alert(`Coupon ${code} applied successfully!`);
    } else {
      alert('Invalid coupon code');
    }
  };

  const removeCoupon = () => {
    localStorage.removeItem('applied_coupon');
    setAppliedCoupon('');
    alert('Coupon removed');
  };

  const filteredCoupons = coupons.filter(coupon =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <StudentLayout>
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Coupons & Discounts
          </h1>
          <p style={{ color: '#6b7280' }}>
            Save money on your purchases with available coupons
          </p>
        </div>

        {/* Apply Coupon Section */}
        <Card style={{ marginBottom: '2rem' }}>
          <CardHeader>
            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Gift size={20} />
              Apply Coupon
            </CardTitle>
          </CardHeader>
          <CardContent>
            {appliedCoupon ? (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '1rem',
                backgroundColor: '#d1fae5',
                borderRadius: '8px'
              }}>
                <div>
                  <p style={{ fontWeight: 'bold', color: '#065f46' }}>
                    Coupon Applied: {appliedCoupon}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#047857' }}>
                    Discount will be applied at checkout
                  </p>
                </div>
                <Button onClick={removeCoupon} variant="outline" size="sm">
                  Remove
                </Button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'end' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Enter Coupon Code
                  </label>
                  <Input
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  />
                </div>
                <Button onClick={() => applyCoupon(couponCode)}>
                  Apply Coupon
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Search */}
        <div style={{ marginBottom: '2rem' }}>
          <Input
            placeholder="Search coupons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: '400px' }}
          />
        </div>

        {/* Available Coupons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {filteredCoupons.length === 0 ? (
            <Card style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎫</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                No coupons available
              </h3>
              <p style={{ color: '#6b7280' }}>
                Check back later for new discount offers
              </p>
            </Card>
          ) : (
            filteredCoupons.map((coupon) => (
              <Card key={coupon.id} style={{ border: '2px solid #e5e7eb', transition: 'all 0.2s' }}>
                <CardContent style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        {coupon.code}
                      </h3>
                      <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        {coupon.description}
                      </p>
                    </div>
                    <div style={{
                      backgroundColor: '#8b5cf6',
                      color: 'white',
                      padding: '0.5rem',
                      borderRadius: '50%'
                    }}>
                      <Percent size={16} />
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: 'bold', 
                      color: '#8b5cf6',
                      marginBottom: '0.5rem'
                    }}>
                      {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                    </div>
                    {coupon.maxDiscount && (
                      <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        Max discount: ₹{coupon.maxDiscount}
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={14} />
                      <span>Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Users size={14} />
                      <span>{coupon.usageLimit - coupon.usedCount} left</span>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      Min order value: ₹{coupon.minOrderValue}
                    </p>
                  </div>

                  <Button
                    onClick={() => applyCoupon(coupon.code)}
                    disabled={appliedCoupon === coupon.code}
                    style={{ width: '100%' }}
                    variant={appliedCoupon === coupon.code ? 'secondary' : 'default'}
                  >
                    {appliedCoupon === coupon.code ? 'Applied' : 'Apply Coupon'}
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </StudentLayout>
  );
}