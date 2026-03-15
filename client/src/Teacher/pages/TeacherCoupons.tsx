import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import NewHeader from '../components/NewHeader';
import { TeacherSidebarDemo } from '../components/TeacherSidebar';
import { Coupon, sampleCoupons } from '@/utils/promoMockData';
import { Percent, Gift, Calendar, Users, Eye, MessageCircle } from 'lucide-react';
import SessionManager from '../../utils/sessionManager';
import '../pages/TeacherDashboard.css';

export default function TeacherCoupons() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const session = SessionManager.getSession();
  const teacherData = {
    name: session?.name || "Teacher",
    role: "Teacher",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  };

  useEffect(() => {
    setCoupons(sampleCoupons.filter(c => c.isActive));
  }, []);

  const recommendCoupon = (couponCode: string) => {
    alert(`Coupon ${couponCode} recommendation sent to students!`);
  };

  const filteredCoupons = coupons.filter(coupon =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <TeacherSidebarDemo open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="dashboard-main" style={{ marginLeft: sidebarOpen ? "250px" : "60px" }}>
        <NewHeader
          avatar={teacherData.avatar}
          name={teacherData.name}
          role={teacherData.role}
          teacherId={session?.id}
          searchPlaceholder="Search..."
        />
        
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Coupons & Discounts (View Only)
            </h1>
            <p style={{ color: '#6b7280' }}>
              View available coupons and recommend them to your students
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <Input
              placeholder="Search coupons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ maxWidth: '400px' }}
            />
          </div>

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

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button
                        onClick={() => recommendCoupon(coupon.code)}
                        style={{ flex: 1 }}
                        variant="outline"
                      >
                        <MessageCircle size={16} style={{ marginRight: '0.5rem' }} />
                        Recommend
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        style={{ padding: '0.5rem' }}
                      >
                        <Eye size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}