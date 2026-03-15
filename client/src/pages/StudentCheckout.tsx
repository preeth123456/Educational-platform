import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StudentLayout from '@/components/StudentLayout';
import { getPlans, mockPayment, Plan } from '@/utils/paymentMock';
import '@/styles/checkout.css';
import { 
  FaCreditCard, 
  FaMobile, 
  FaUniversity, 
  FaLock, 
  FaPercent,
  FaSpinner
} from 'react-icons/fa';

export default function StudentCheckout() {
  const [location, navigate] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [billingType, setBillingType] = useState<'monthly' | 'yearly'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [sendInvoice, setSendInvoice] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  // Form states
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [bankName, setBankName] = useState('');

  const planId = location.split('/').pop();
  const plans = getPlans();

  useEffect(() => {
    const storedPlan = localStorage.getItem('selected_plan');
    if (storedPlan) {
      setSelectedPlan(JSON.parse(storedPlan));
    } else if (planId) {
      const plan = plans.find(p => p.planId === planId);
      if (plan) {
        const planData: Plan = {
          planId: plan.planId,
          planName: plan.planName,
          price: plan.price,
          currency: plan.currency,
          billing: plan.billing
        };
        setSelectedPlan(planData);
        localStorage.setItem('selected_plan', JSON.stringify(planData));
      }
    }
  }, [planId]);

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === 'save10') {
      setDiscount(10);
    } else if (couponCode.toLowerCase() === 'student20') {
      setDiscount(20);
    } else {
      setDiscount(0);
    }
  };

  const calculateTotal = () => {
    if (!selectedPlan) return 0;
    
    let basePrice = selectedPlan.price;
    if (billingType === 'yearly') {
      basePrice = basePrice * 12 * 0.8; // 20% discount for yearly
    }
    
    const discountAmount = (basePrice * discount) / 100;
    const subtotal = basePrice - discountAmount;
    const gst = Math.round(subtotal * 0.18);
    
    return {
      basePrice,
      discountAmount,
      subtotal,
      gst,
      total: subtotal + gst
    };
  };

  const handlePayment = async () => {
    if (!selectedPlan || !agreeTerms) return;
    
    setProcessing(true);
    
    try {
      // Wait 1.5 seconds
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 80% success, 20% failed
      const isSuccess = Math.random() > 0.2;
      
      // Generate payment ID
      const paymentId = `PAY${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
      
      const paymentResult = {
        paymentId,
        status: isSuccess ? 'success' : 'failed',
        amount: totals.total,
        planId: selectedPlan.planId,
        createdAt: new Date().toISOString(),
        method: paymentMethod.toUpperCase()
      };
      
      // Store in localStorage
      localStorage.setItem('last_payment', JSON.stringify(paymentResult));
      
      // Navigate to payment status
      if (isSuccess) {
        navigate(`/student/payment-status?status=success`);
      } else {
        navigate(`/student/payment-status?status=failed`);
      }
    } catch (error) {
      navigate(`/student/payment-status?status=failed`);
    } finally {
      setProcessing(false);
    }
  };

  if (!selectedPlan) {
    return (
      <StudentLayout>
        <div className="dashboard-main" style={{ paddingTop: '80px' }}>
          <div className="dashboard-content">
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <h2>Plan not found</h2>
              <Button onClick={() => navigate('/student/plans')}>
                Go back to plans
              </Button>
            </div>
          </div>
        </div>
      </StudentLayout>
    );
  }

  const totals = calculateTotal();

  return (
    <StudentLayout>
      <div className="dashboard-main" style={{ paddingTop: '80px' }}>
        <div className="dashboard-content">
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>
              Complete Your Purchase
            </h1>
            
            <div className="checkout-grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '2rem'
            }}>
              {/* Order Summary */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                height: 'fit-content'
              }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                  Order Summary
                </h3>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                    {selectedPlan.planName} Plan
                  </h4>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    Full access to premium features
                  </p>
                </div>

                {/* Billing Toggle */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
                    Billing Cycle
                  </label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                      onClick={() => setBillingType('monthly')}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        border: '2px solid',
                        borderColor: billingType === 'monthly' ? '#8b5cf6' : '#e5e7eb',
                        backgroundColor: billingType === 'monthly' ? '#f3f4f6' : 'white',
                        cursor: 'pointer'
                      }}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setBillingType('yearly')}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        border: '2px solid',
                        borderColor: billingType === 'yearly' ? '#8b5cf6' : '#e5e7eb',
                        backgroundColor: billingType === 'yearly' ? '#f3f4f6' : 'white',
                        cursor: 'pointer',
                        position: 'relative'
                      }}
                    >
                      Yearly
                      <span style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        backgroundColor: '#10b981',
                        color: 'white',
                        fontSize: '0.75rem',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        20% OFF
                      </span>
                    </button>
                  </div>
                </div>

                {/* Coupon */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
                    Coupon Code
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <Button onClick={applyCoupon} variant="outline">
                      Apply
                    </Button>
                  </div>
                  {discount > 0 && (
                    <p style={{ color: '#10b981', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                      <FaPercent /> {discount}% discount applied!
                    </p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Base Price ({billingType})</span>
                    <span>₹{totals.basePrice.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#10b981' }}>
                      <span>Discount ({discount}%)</span>
                      <span>-₹{totals.discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>GST (18%)</span>
                    <span>₹{totals.gst.toLocaleString()}</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    fontWeight: 'bold', 
                    fontSize: '1.25rem',
                    borderTop: '1px solid #e5e7eb',
                    paddingTop: '0.5rem',
                    marginTop: '0.5rem'
                  }}>
                    <span>Total</span>
                    <span style={{ color: '#8b5cf6' }}>₹{totals.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                  Payment Method
                </h3>

                {/* Payment Method Tabs */}
                <div style={{ display: 'flex', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                  {[
                    { key: 'upi', label: 'UPI', icon: <FaMobile /> },
                    { key: 'card', label: 'Card', icon: <FaCreditCard /> },
                    { key: 'netbanking', label: 'Net Banking', icon: <FaUniversity /> }
                  ].map((method) => (
                    <button
                      key={method.key}
                      onClick={() => setPaymentMethod(method.key as any)}
                      style={{
                        flex: 1,
                        padding: '1rem',
                        border: 'none',
                        backgroundColor: 'transparent',
                        borderBottom: paymentMethod === method.key ? '2px solid #8b5cf6' : '2px solid transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        color: paymentMethod === method.key ? '#8b5cf6' : '#6b7280'
                      }}
                    >
                      {method.icon}
                      {method.label}
                    </button>
                  ))}
                </div>

                {/* Payment Forms */}
                <div style={{ marginBottom: '1.5rem' }}>
                  {paymentMethod === 'upi' && (
                    <div>
                      <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
                        UPI ID
                      </label>
                      <Input
                        placeholder="yourname@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                      />
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                      <div>
                        <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
                          Card Number
                        </label>
                        <Input
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
                            Expiry Date
                          </label>
                          <Input
                            placeholder="MM/YY"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                          />
                        </div>
                        <div>
                          <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
                            CVV
                          </label>
                          <Input
                            placeholder="123"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
                          Cardholder Name
                        </label>
                        <Input
                          placeholder="John Doe"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'netbanking' && (
                    <div>
                      <label style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'block' }}>
                        Select Bank
                      </label>
                      <select
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          border: '1px solid #d1d5db',
                          fontSize: '1rem'
                        }}
                      >
                        <option value="">Choose your bank</option>
                        <option value="sbi">State Bank of India</option>
                        <option value="hdfc">HDFC Bank</option>
                        <option value="icici">ICICI Bank</option>
                        <option value="axis">Axis Bank</option>
                        <option value="kotak">Kotak Mahindra Bank</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Checkboxes */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                    />
                    <span>I agree to the Terms & Conditions</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={sendInvoice}
                      onChange={(e) => setSendInvoice(e.target.checked)}
                    />
                    <span>Send invoice to my email</span>
                  </label>
                </div>

                {/* Pay Button */}
                <Button
                  onClick={handlePayment}
                  disabled={!agreeTerms || processing}
                  style={{
                    width: '100%',
                    backgroundColor: '#8b5cf6',
                    color: 'white',
                    fontWeight: '600',
                    padding: '1rem',
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {processing ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaLock />
                      Pay ₹{totals.total.toLocaleString()} Securely
                    </>
                  )}
                </Button>

                <p style={{ 
                  textAlign: 'center', 
                  fontSize: '0.875rem', 
                  color: '#6b7280', 
                  marginTop: '1rem' 
                }}>
                  <FaLock style={{ marginRight: '0.25rem' }} />
                  Your payment information is secure and encrypted
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}