import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useLocation } from 'wouter';
import StudentLayout from '@/components/StudentLayout';
import { Check, Download, CreditCard, Calendar, Shield } from 'lucide-react';

interface Subscription {
  planName: string;
  status: 'Active' | 'Expired' | 'Cancelled';
  validTill: string;
  amount: number;
}

interface Payment {
  date: string;
  amount: number;
  status: 'Paid' | 'Failed';
  invoiceId: string;
}

export default function StudentSubscriptionManagement() {
  const [, navigate] = useLocation();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [autoRenewal, setAutoRenewal] = useState(true);
  const [subscription, setSubscription] = useState<Subscription>({
    planName: 'Pro Plan',
    status: 'Active',
    validTill: '2024-12-31',
    amount: 499
  });

  const planBenefits = [
    'Unlimited access to premium courses',
    'Priority doubt support',
    'Access to live virtual classrooms',
    'Downloadable study materials',
    'Progress analytics dashboard'
  ];

  const recentPayments: Payment[] = [
    { date: '2024-01-15', amount: 499, status: 'Paid', invoiceId: 'INV-2024-001' },
    { date: '2023-12-15', amount: 499, status: 'Paid', invoiceId: 'INV-2023-012' }
  ];

  const handleCancelSubscription = () => {
    setSubscription(prev => ({ ...prev, status: 'Cancelled' }));
    setShowCancelModal(false);
    alert('Subscription cancelled successfully');
  };

  const handleUpgradePlan = () => {
    navigate('/student/plans');
  };

  const handleViewPaymentHistory = () => {
    navigate('/student/payment-history');
  };

  const downloadInvoice = (invoiceId: string) => {
    alert(`Downloading invoice ${invoiceId}`);
  };

  return (
    <StudentLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Subscription Management</h1>
        
        {/* Current Plan Card - Keep as is */}
        <Card className="border border-gray-200 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Current Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{subscription.planName}</h3>
                <Badge variant={subscription.status === 'Active' ? 'default' : 'secondary'} className="mt-2">
                  {subscription.status}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-purple-600">₹{subscription.amount}</p>
                <p className="text-gray-600">per month</p>
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <p className="text-sm text-purple-700 font-medium">Valid Till</p>
              <p className="text-lg font-semibold text-purple-900">{new Date(subscription.validTill).toLocaleDateString()}</p>
            </div>

            <div className="flex gap-3 flex-wrap">
              <Button onClick={handleUpgradePlan} className="bg-purple-600 hover:bg-purple-700 text-white">
                Upgrade Plan
              </Button>
              <Button onClick={handleViewPaymentHistory} variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                View Payment History
              </Button>
              {subscription.status === 'Active' && (
                <Button onClick={() => setShowCancelModal(true)} variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                  Cancel Subscription
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Section 1: Plan Benefits Card */}
        <Card className="border border-gray-200 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              Your Plan Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {planBenefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Billing Details Card */}
        <Card className="border border-gray-200 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-purple-600" />
              Billing Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 font-medium">Next Billing Date</p>
                <p className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(subscription.validTill).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 font-medium">Payment Method</p>
                <p className="text-lg font-semibold text-gray-900">UPI (Google Pay)</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-100">
              <div>
                <p className="font-medium text-purple-900">Auto-Renewal</p>
                <p className="text-sm text-purple-700">Automatically renew subscription</p>
              </div>
              <Switch 
                checked={autoRenewal} 
                onCheckedChange={setAutoRenewal}
                className="data-[state=checked]:bg-purple-600"
              />
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 font-medium">Subscription ID</p>
              <p className="text-lg font-mono text-gray-900">SUB-2024-EDU-001</p>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Recent Payments Preview */}
        <Card className="border border-gray-200 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Amount</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-2 font-semibold text-gray-700">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map((payment, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 px-2 text-gray-900">{new Date(payment.date).toLocaleDateString()}</td>
                      <td className="py-3 px-2 font-semibold text-gray-900">₹{payment.amount}</td>
                      <td className="py-3 px-2">
                        <Badge variant={payment.status === 'Paid' ? 'default' : 'destructive'}>
                          {payment.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => downloadInvoice(payment.invoiceId)}
                          className="text-purple-600 border-purple-600 hover:bg-purple-50"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Cancel Confirmation Modal */}
        <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Subscription</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-gray-700">Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your current billing period.</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCancelModal(false)}>
                Keep Subscription
              </Button>
              <Button onClick={handleCancelSubscription} className="bg-red-600 hover:bg-red-700 text-white">
                Cancel Subscription
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </StudentLayout>
  );
}