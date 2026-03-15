import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StudentLayout from '@/components/StudentLayout';
import { entitlementService } from '@/utils/entitlementService';
import { Gift, GraduationCap, Crown, Wallet, Calendar, CheckCircle, TrendingUp, Clock, Star, ArrowRight, Activity, CreditCard } from 'lucide-react';

export default function StudentMyBenefits() {
  const [appliedCoupon, setAppliedCoupon] = useState<string>('');
  const [accessSummary, setAccessSummary] = useState<any>(null);
  const [entitlements, setEntitlements] = useState<any[]>([]);

  useEffect(() => {
    // Mock student ID
    const studentId = 'STU001';
    
    // Get applied coupon
    const coupon = localStorage.getItem('applied_coupon');
    if (coupon) setAppliedCoupon(coupon);

    // Get entitlements
    const summary = entitlementService.getAccessSummary(studentId);
    setAccessSummary(summary);

    const userEntitlements = entitlementService.getStudentEntitlements(studentId);
    setEntitlements(userEntitlements);
  }, []);

  const getEntitlementIcon = (type: string) => {
    switch (type) {
      case 'PLAN_ACCESS': return <Crown size={20} />;
      case 'WALLET_CREDITS': return <Wallet size={20} />;
      case 'COURSE_UNLOCK': return <GraduationCap size={20} />;
      default: return <Gift size={20} />;
    }
  };

  const getEntitlementColor = (type: string) => {
    switch (type) {
      case 'PLAN_ACCESS': return '#8b5cf6';
      case 'WALLET_CREDITS': return '#10b981';
      case 'COURSE_UNLOCK': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <StudentLayout>
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            My Benefits
          </h1>
          <p style={{ color: '#6b7280' }}>
            Overview of your active benefits, coupons, and entitlements
          </p>
        </div>

        {/* Entitlement Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Total Entitlements */}
          <Card>
            <CardContent style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '0.75rem',
                  borderRadius: '50%'
                }}>
                  <Gift size={20} />
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Total Entitlements
                  </p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                    {entitlements.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Entitlements */}
          <Card>
            <CardContent style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '0.75rem',
                  borderRadius: '50%'
                }}>
                  <CheckCircle size={20} />
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Active Entitlements
                  </p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                    {entitlements.filter(e => e.isActive).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expiring Soon */}
          <Card>
            <CardContent style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  padding: '0.75rem',
                  borderRadius: '50%'
                }}>
                  <Clock size={20} />
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Expiring Soon
                  </p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                    2
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Balance */}
          <Card>
            <CardContent style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '0.75rem',
                  borderRadius: '50%'
                }}>
                  <Wallet size={20} />
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Wallet Balance
                  </p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                    ₹{accessSummary?.walletCredits || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Active Plan */}
          <Card>
            <CardContent style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  backgroundColor: accessSummary?.hasActivePlan ? '#8b5cf6' : '#e5e7eb',
                  color: 'white',
                  padding: '0.75rem',
                  borderRadius: '50%'
                }}>
                  <Crown size={20} />
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Active Plan
                  </p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                    {accessSummary?.hasActivePlan ? accessSummary.planType : 'No Active Plan'}
                  </p>
                  {accessSummary?.expiryDate && (
                    <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      Expires: {new Date(accessSummary.expiryDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Credits */}
          <Card>
            <CardContent style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '0.75rem',
                  borderRadius: '50%'
                }}>
                  <Wallet size={20} />
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Wallet Credits
                  </p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                    ₹{accessSummary?.walletCredits || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Premium Access */}
          <Card>
            <CardContent style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  backgroundColor: accessSummary?.premiumAccess ? '#f59e0b' : '#e5e7eb',
                  color: 'white',
                  padding: '0.75rem',
                  borderRadius: '50%'
                }}>
                  <GraduationCap size={20} />
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Premium Access
                  </p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                    {accessSummary?.premiumAccess ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Benefit Activity */}
        <Card style={{ marginBottom: '2rem' }}>
          <CardHeader>
            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={20} />
              Recent Benefit Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {[
                { type: 'coupon', action: 'Coupon Applied', detail: 'SAVE20 - 20% discount', time: '2 hours ago', icon: Gift, color: '#10b981' },
                { type: 'scholarship', action: 'Scholarship Applied', detail: 'Merit Scholarship Program', time: '1 day ago', icon: GraduationCap, color: '#8b5cf6' },
                { type: 'scholarship', action: 'Scholarship Approved', detail: 'Academic Excellence Award', time: '3 days ago', icon: CheckCircle, color: '#10b981' },
                { type: 'wallet', action: 'Wallet Credit Added', detail: '₹500 bonus credit', time: '5 days ago', icon: Wallet, color: '#10b981' },
                { type: 'premium', action: 'Premium Activated', detail: 'Premium Plan Access', time: '1 week ago', icon: Crown, color: '#8b5cf6' }
              ].map((activity, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}>
                  <div style={{
                    color: activity.color,
                    padding: '0.5rem',
                    backgroundColor: activity.color + '20',
                    borderRadius: '8px'
                  }}>
                    <activity.icon size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                      {activity.action}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {activity.detail}
                    </p>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {activity.time}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommended Benefits */}
        <Card style={{ marginBottom: '2rem' }}>
          <CardHeader>
            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Star size={20} />
              Recommended Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              {[
                { title: 'Premium Study Materials', description: 'Access exclusive content and practice tests', discount: '30% OFF', color: '#8b5cf6' },
                { title: 'One-on-One Tutoring', description: 'Personal guidance from expert teachers', discount: '₹500 OFF', color: '#10b981' },
                { title: 'Exam Prep Bundle', description: 'Complete preparation package for your board', discount: '25% OFF', color: '#f59e0b' }
              ].map((benefit, index) => (
                <div key={index} style={{
                  padding: '1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  ':hover': { borderColor: benefit.color }
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontWeight: '600', fontSize: '0.875rem' }}>
                      {benefit.title}
                    </h4>
                    <Badge style={{ backgroundColor: benefit.color, color: 'white' }}>
                      {benefit.discount}
                    </Badge>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                    {benefit.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: benefit.color, fontSize: '0.75rem', fontWeight: '500' }}>
                    Learn More <ArrowRight size={12} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Scholarship Progress Tracker */}
        <Card style={{ marginBottom: '2rem' }}>
          <CardHeader>
            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={20} />
              Scholarship Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0' }}>
              {[
                { step: 'Applied', status: 'completed', color: '#10b981' },
                { step: 'Under Review', status: 'completed', color: '#10b981' },
                { step: 'Approved', status: 'current', color: '#f59e0b' },
                { step: 'Active', status: 'pending', color: '#e5e7eb' }
              ].map((stage, index) => (
                <React.Fragment key={stage.step}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '2rem',
                      height: '2rem',
                      borderRadius: '50%',
                      backgroundColor: stage.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: stage.status === 'pending' ? '#6b7280' : 'white',
                      fontWeight: 'bold',
                      fontSize: '0.75rem'
                    }}>
                      {stage.status === 'completed' ? <CheckCircle size={16} /> : index + 1}
                    </div>
                    <p style={{
                      fontSize: '0.75rem',
                      fontWeight: stage.status === 'current' ? '600' : '400',
                      color: stage.status === 'current' ? '#1f2937' : '#6b7280'
                    }}>
                      {stage.step}
                    </p>
                  </div>
                  {index < 3 && (
                    <div style={{
                      flex: 1,
                      height: '2px',
                      backgroundColor: stage.status === 'completed' ? '#10b981' : '#e5e7eb',
                      margin: '0 0.5rem'
                    }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Wallet Transactions */}
        <Card style={{ marginBottom: '2rem' }}>
          <CardHeader>
            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard size={20} />
              Recent Wallet Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {[
                { type: 'credit', description: 'Scholarship Bonus', amount: '+₹500', date: '2024-01-15', color: '#10b981' },
                { type: 'debit', description: 'Course Purchase', amount: '-₹299', date: '2024-01-12', color: '#ef4444' },
                { type: 'credit', description: 'Referral Bonus', amount: '+₹100', date: '2024-01-10', color: '#10b981' },
                { type: 'debit', description: 'Premium Upgrade', amount: '-₹199', date: '2024-01-08', color: '#ef4444' },
                { type: 'credit', description: 'Welcome Bonus', amount: '+₹250', date: '2024-01-05', color: '#10b981' }
              ].map((transaction, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  border: '1px solid #f3f4f6',
                  borderRadius: '6px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: transaction.color
                    }} />
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                        {transaction.description}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        {transaction.date}
                      </p>
                    </div>
                  </div>
                  <p style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: transaction.color
                  }}>
                    {transaction.amount}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Active Coupon */}
          <Card>
            <CardHeader>
              <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Gift size={20} />
                Active Coupon
              </CardTitle>
            </CardHeader>
            <CardContent>
              {appliedCoupon ? (
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#d1fae5',
                  borderRadius: '8px',
                  border: '1px solid #10b981'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <CheckCircle size={16} style={{ color: '#10b981' }} />
                    <span style={{ fontWeight: 'bold', color: '#065f46' }}>
                      {appliedCoupon}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#047857' }}>
                    Discount will be applied at checkout
                  </p>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                  <Gift size={32} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                  <p>No active coupon</p>
                  <p style={{ fontSize: '0.875rem' }}>
                    Visit the Coupons page to apply one
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Scholarship Status */}
          <Card>
            <CardHeader>
              <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <GraduationCap size={20} />
                Scholarship Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {entitlements.some(e => e.grantedBy.includes('Scholarship')) ? (
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#ddd6fe',
                  borderRadius: '8px',
                  border: '1px solid #8b5cf6'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <CheckCircle size={16} style={{ color: '#8b5cf6' }} />
                    <span style={{ fontWeight: 'bold', color: '#5b21b6' }}>
                      Scholarship Active
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#6d28d9' }}>
                    {entitlements.find(e => e.grantedBy.includes('Scholarship'))?.grantedBy}
                  </p>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                  <GraduationCap size={32} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                  <p>No active scholarship</p>
                  <p style={{ fontSize: '0.875rem' }}>
                    Apply for scholarships to get benefits
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* All Entitlements */}
        <Card style={{ marginTop: '2rem' }}>
          <CardHeader>
            <CardTitle>All Entitlements</CardTitle>
          </CardHeader>
          <CardContent>
            {entitlements.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                <Gift size={32} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <p>No entitlements found</p>
                <p style={{ fontSize: '0.875rem' }}>
                  Entitlements will appear here when granted
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {entitlements.map((entitlement) => (
                  <div
                    key={entitlement.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        color: getEntitlementColor(entitlement.type),
                        padding: '0.5rem',
                        backgroundColor: getEntitlementColor(entitlement.type) + '20',
                        borderRadius: '8px'
                      }}>
                        {getEntitlementIcon(entitlement.type)}
                      </div>
                      <div>
                        <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                          {entitlement.description}
                        </p>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          Granted by: {entitlement.grantedBy}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {new Date(entitlement.grantedAt).toLocaleDateString()}
                          {entitlement.expiresAt && ` - Expires: ${new Date(entitlement.expiresAt).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Badge variant={entitlement.isActive ? 'default' : 'secondary'}>
                        {entitlement.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
}