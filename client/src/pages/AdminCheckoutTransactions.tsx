import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AdminLayout from '@/components/AdminLayout';
import { Invoice } from '@/utils/paymentMock';

interface TransactionStats {
  totalRevenue: number;
  successPayments: number;
  failedPayments: number;
  pendingPayments: number;
  activeSubscriptions: number;
  totalTransactions: number;
}

export default function AdminCheckoutTransactions() {
  const [transactions, setTransactions] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<TransactionStats>({
    totalRevenue: 0,
    successPayments: 0,
    failedPayments: 0,
    pendingPayments: 0,
    activeSubscriptions: 0,
    totalTransactions: 0
  });
  const [selectedTransaction, setSelectedTransaction] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = () => {
    // Load from localStorage
    const invoices = JSON.parse(localStorage.getItem('student_invoices') || '[]') || [];
    const lastPayment = localStorage.getItem('last_payment');
    
    let allTransactions = [...invoices];
    
    // Add last payment if it exists and isn't already in invoices
    if (lastPayment) {
      const payment = JSON.parse(lastPayment);
      const exists = invoices.find((inv: Invoice) => inv.paymentId === payment.paymentId);
      if (!exists && payment.status === 'success') {
        const invoice: Invoice = {
          id: `INV-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          planName: 'Pro',
          amount: payment.amount,
          status: 'Paid',
          date: new Date(payment.createdAt).toLocaleDateString('en-IN'),
          paymentId: payment.paymentId,
          method: payment.method
        };
        allTransactions.unshift(invoice);
      }
    }

    // Add some mock data for demo
    const mockTransactions: Invoice[] = [
      {
        id: 'INV-2024-001',
        planName: 'Basic',
        amount: 235,
        status: 'Paid',
        date: '2024-01-15',
        paymentId: 'PAY123456',
        method: 'UPI'
      },
      {
        id: 'INV-2024-002',
        planName: 'Pro',
        amount: 588,
        status: 'Paid',
        date: '2024-01-16',
        paymentId: 'PAY123457',
        method: 'Card'
      },
      {
        id: 'INV-2024-003',
        planName: 'Premium',
        amount: 1179,
        status: 'Failed',
        date: '2024-01-17',
        paymentId: 'PAY123458',
        method: 'NetBanking'
      }
    ];

    allTransactions = [...allTransactions, ...mockTransactions];
    setTransactions(allTransactions || []);

    // Calculate stats
    const totalRevenue = allTransactions
      .filter(t => t.status === 'Paid')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const successPayments = allTransactions.filter(t => t.status === 'Paid').length;
    const failedPayments = allTransactions.filter(t => t.status === 'Failed').length;
    
    setStats({
      totalRevenue,
      successPayments,
      failedPayments,
      pendingPayments: 0,
      activeSubscriptions: successPayments,
      totalTransactions: allTransactions.length
    });
  };

  const filteredTransactions = transactions.filter(transaction => {
    const searchText = searchTerm?.toLowerCase() || "";
    const matchesSearch = 
      (transaction?.id?.toLowerCase() || "").includes(searchText) ||
      (transaction?.paymentId?.toLowerCase() || "").includes(searchText) ||
      (transaction?.planName?.toLowerCase() || "").includes(searchText);
    
    const matchesStatus = statusFilter === 'all' || (transaction?.status?.toLowerCase() || "") === statusFilter.toLowerCase();
    const matchesPlan = planFilter === 'all' || (transaction?.planName?.toLowerCase() || "") === planFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const downloadInvoice = (transaction: Invoice) => {
    const invoiceContent = `
EDUYATA - Transaction Invoice
============================

Invoice ID: ${transaction.id}
Payment ID: ${transaction.paymentId}
Plan: ${transaction.planName}
Amount: ₹${transaction.amount.toLocaleString()}
Status: ${transaction.status}
Method: ${transaction.method}
Date: ${transaction.date}

Student ID: STU-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}

Thank you for your business!
    `;
    
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${transaction.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Checkout & Transactions
          </h1>
          <p style={{ color: '#6b7280' }}>
            Monitor payment transactions and subscription management
          </p>
        </div>

        {/* KPI Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  Total Revenue
                </p>
                <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#10b981' }}>
                  ₹{stats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div style={{
                backgroundColor: '#d1fae5',
                borderRadius: '50%',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                💰
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  Success Payments
                </p>
                <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#10b981' }}>
                  {stats.successPayments}
                </p>
              </div>
              <div style={{
                backgroundColor: '#d1fae5',
                borderRadius: '50%',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                ✅
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  Failed Payments
                </p>
                <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#ef4444' }}>
                  {stats.failedPayments}
                </p>
              </div>
              <div style={{
                backgroundColor: '#fee2e2',
                borderRadius: '50%',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                ❌
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  Active Subscriptions
                </p>
                <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#8b5cf6' }}>
                  {stats.activeSubscriptions}
                </p>
              </div>
              <div style={{
                backgroundColor: '#ede9fe',
                borderRadius: '50%',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                👥
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  Total Transactions
                </p>
                <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#374151' }}>
                  {stats.totalTransactions}
                </p>
              </div>
              <div style={{
                backgroundColor: '#f3f4f6',
                borderRadius: '50%',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                🧾
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem',
            alignItems: 'end'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                🔍 Search
              </label>
              <Input
                placeholder="Search by ID, Payment ID, or Plan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db'
                }}
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Plan
              </label>
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db'
                }}
              >
                <option value="all">All Plans</option>
                <option value="basic">Basic</option>
                <option value="pro">Pro</option>
                <option value="premium">Premium</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
              Recent Transactions ({filteredTransactions.length})
            </h3>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                    Payment ID
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                    Student ID
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                    Plan
                  </th>
                  <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#374151' }}>
                    Amount
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                    Method
                  </th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>
                    Status
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>
                    Date
                  </th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px', fontWeight: '600', color: '#8b5cf6' }}>
                      {transaction.paymentId}
                    </td>
                    <td style={{ padding: '12px' }}>
                      STU-{Math.floor(Math.random() * 1000).toString().padStart(3, '0')}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {transaction.planName}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>
                      ₹{transaction.amount.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {transaction.method}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: transaction.status === 'Paid' ? '#d1fae5' : '#fee2e2',
                        color: transaction.status === 'Paid' ? '#065f46' : '#991b1b'
                      }}>
                        {transaction.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {transaction.date}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedTransaction(transaction)}
                        style={{ marginRight: '0.5rem' }}
                      >
                        👁️
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transaction Detail Modal */}
        {selectedTransaction && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  Transaction Details
                </h3>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: '#6b7280'
                  }}
                >
                  ❌
                </button>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Payment ID:</span>
                    <span style={{ fontWeight: '600' }}>{selectedTransaction.paymentId}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Invoice ID:</span>
                    <span style={{ fontWeight: '600' }}>{selectedTransaction.id}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Student ID:</span>
                    <span style={{ fontWeight: '600' }}>
                      STU-{Math.floor(Math.random() * 1000).toString().padStart(3, '0')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Plan:</span>
                    <span style={{ fontWeight: '600' }}>{selectedTransaction.planName}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Amount:</span>
                    <span style={{ fontWeight: '600', fontSize: '1.25rem', color: '#8b5cf6' }}>
                      ₹{selectedTransaction.amount.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Method:</span>
                    <span style={{ fontWeight: '600' }}>{selectedTransaction.method}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Status:</span>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: selectedTransaction.status === 'Paid' ? '#d1fae5' : '#fee2e2',
                      color: selectedTransaction.status === 'Paid' ? '#065f46' : '#991b1b'
                    }}>
                      {selectedTransaction.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Date:</span>
                    <span style={{ fontWeight: '600' }}>{selectedTransaction.date}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <Button
                  onClick={() => downloadInvoice(selectedTransaction)}
                  style={{
                    backgroundColor: '#8b5cf6',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  📥 Download Invoice
                </Button>
                <Button
                  onClick={() => setSelectedTransaction(null)}
                  variant="outline"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}