import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import StudentLayout from '@/components/StudentLayout';
import { getPlans } from '@/utils/paymentMock';
import '@/styles/checkout.css';
import { 
  FaCrown, 
  FaCheck, 
  FaStar, 
  FaShieldAlt, 
  FaFileInvoice, 
  FaHeadphones,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

export default function StudentPlans() {
  const [, navigate] = useLocation();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const plans = getPlans();

  const handleBuyNow = (planId: string) => {
    const selectedPlan = plans.find(p => p.planId === planId);
    if (selectedPlan) {
      localStorage.setItem('selected_plan', JSON.stringify({
        planId: selectedPlan.planId,
        planName: selectedPlan.planName,
        price: selectedPlan.price,
        currency: selectedPlan.currency,
        billing: selectedPlan.billing
      }));
      navigate(`/student/checkout/${planId}`);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const faqs = [
    {
      question: "Can I change my plan anytime?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept UPI, Credit/Debit Cards, Net Banking, and all major digital wallets."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes, all new users get a 7-day free trial with full access to Pro features."
    },
    {
      question: "Can I get a refund if I'm not satisfied?",
      answer: "We offer a 30-day money-back guarantee for all paid plans. No questions asked."
    },
    {
      question: "Do you offer student discounts?",
      answer: "Yes, we offer up to 50% discount for verified students. Contact support for more details."
    },
    {
      question: "Is my payment information secure?",
      answer: "Absolutely. We use industry-standard encryption and never store your payment details."
    }
  ];

  const comparisonFeatures = [
    { feature: "Course Access", free: "Limited", basic: "Basic Courses", pro: "All Courses", premium: "All + Exclusive" },
    { feature: "Video Quality", free: "480p", basic: "720p", pro: "1080p HD", premium: "4K Ultra HD" },
    { feature: "Downloads", free: "❌", basic: "❌", pro: "✅", premium: "✅" },
    { feature: "Support", free: "Community", basic: "Email", pro: "Priority", premium: "1-on-1" },
    { feature: "Analytics", free: "Basic", basic: "Standard", pro: "Advanced", premium: "Custom" },
    { feature: "Certificates", free: "❌", basic: "❌", pro: "✅", premium: "✅ + Verified" },
    { feature: "Live Sessions", free: "❌", basic: "❌", pro: "✅", premium: "✅ + Private" },
    { feature: "API Access", free: "❌", basic: "❌", pro: "❌", premium: "✅" }
  ];

  return (
    <StudentLayout>
      <div className="dashboard-main" style={{ paddingTop: '80px' }}>
        <div className="dashboard-content">
          {/* Hero Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
            borderRadius: '16px',
            padding: '3rem 2rem',
            color: 'white',
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Upgrade Your Learning
            </h1>
            <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '2rem' }}>
              Choose a plan and unlock premium features to accelerate your growth
            </p>
            <Button 
              onClick={() => scrollToSection('comparison')}
              style={{ 
                backgroundColor: 'white', 
                color: '#8b5cf6', 
                fontWeight: '600',
                padding: '12px 24px'
              }}
            >
              Compare Plans
            </Button>
          </div>

          {/* Current Plan Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            marginBottom: '2rem',
            border: '2px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  Current Plan: <span style={{ color: '#8b5cf6' }}>Free</span>
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{
                    backgroundColor: '#d1fae5',
                    color: '#065f46',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>
                    Active
                  </span>
                  <span style={{ color: '#6b7280' }}>Valid till: Unlimited</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => scrollToSection('invoices')}
                style={{ borderColor: '#8b5cf6', color: '#8b5cf6' }}
              >
                Manage Subscription
              </Button>
            </div>
          </div>

          {/* Plans Grid */}
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' }}>
              Choose Your Plan
            </h2>
            <div className="plans-grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '2rem' 
            }}>
              {plans.map((plan) => (
                <div
                  key={plan.planId}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: '2rem',
                    boxShadow: plan.badge ? '0 8px 25px rgba(139, 92, 246, 0.15)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
                    border: plan.badge ? '2px solid #8b5cf6' : '2px solid #e5e7eb',
                    position: 'relative',
                    transform: plan.badge ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {plan.badge && (
                    <div style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: '#8b5cf6',
                      color: 'white',
                      padding: '6px 16px',
                      borderRadius: '20px',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}>
                      {plan.badge}
                    </div>
                  )}
                  
                  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      {plan.planName}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#8b5cf6' }}>
                        ₹{plan.price}
                      </span>
                      <span style={{ color: '#6b7280' }}>/ month</span>
                    </div>
                  </div>

                  <ul style={{ marginBottom: '2rem', listStyle: 'none', padding: 0 }}>
                    {plan.features.map((feature, idx) => (
                      <li key={idx} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.75rem', 
                        marginBottom: '0.75rem' 
                      }}>
                        <FaCheck style={{ color: '#10b981', fontSize: '0.875rem' }} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleBuyNow(plan.planId)}
                    style={{
                      width: '100%',
                      backgroundColor: plan.badge ? '#8b5cf6' : '#f3f4f6',
                      color: plan.badge ? 'white' : '#374151',
                      fontWeight: '600',
                      padding: '12px',
                      border: 'none'
                    }}
                  >
                    Buy Now
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Plan Comparison Table */}
          <div id="comparison" style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' }}>
              Detailed Comparison
            </h2>
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '12px', 
              overflow: 'hidden',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f9fafb' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Features</th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Free</th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Basic</th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Pro</th>
                      <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600' }}>Premium</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '1rem', fontWeight: '500' }}>{row.feature}</td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>{row.free}</td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>{row.basic}</td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>{row.pro}</td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>{row.premium}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' }}>
              Frequently Asked Questions
            </h2>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '1.5rem',
                      textAlign: 'left',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontWeight: '600'
                    }}
                  >
                    {faq.question}
                    {expandedFaq === idx ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                  {expandedFaq === idx && (
                    <div style={{ padding: '0 1.5rem 1.5rem', color: '#6b7280' }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Security Strip */}
          <div id="invoices" style={{
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '3rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FaShieldAlt style={{ color: '#10b981', fontSize: '1.5rem' }} />
                <span style={{ fontWeight: '600' }}>Secure Payment</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FaFileInvoice style={{ color: '#8b5cf6', fontSize: '1.5rem' }} />
                <span style={{ fontWeight: '600' }}>Instant Invoice</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FaHeadphones style={{ color: '#f59e0b', fontSize: '1.5rem' }} />
                <span style={{ fontWeight: '600' }}>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}