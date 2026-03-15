import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Layout from '@/components/Layout';
import { walletService, WalletBalance, WalletTransaction } from '@/utils/walletService';

export default function StudentWalletPage() {
  const [wallet, setWallet] = useState<WalletBalance>({ balance: 0, currency: 'INR', updatedAt: '' });
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [addAmount, setAddAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = () => {
    setWallet(walletService.getWalletBalance());
    setTransactions(walletService.getTransactions());
  };

  const handleAddMoney = async () => {
    const amount = parseFloat(addAmount);
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    walletService.addMoney(amount, paymentMethod);
    loadWalletData();
    setAddAmount('');
    setLoading(false);
    alert('Money added successfully!');
  };

  return (
    <Layout>
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
          My Wallet
        </h1>

        {/* Wallet Balance Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
          color: 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem', opacity: 0.9 }}>
                Current Balance
              </p>
              <p style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                ₹{wallet.balance.toLocaleString()}
              </p>
              <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                Last updated: {new Date(wallet.updatedAt).toLocaleString()}
              </p>
            </div>
            <div style={{ fontSize: '4rem', opacity: 0.3 }}>
              💰
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Add Money Section */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
              Add Money
            </h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Amount (₹)
              </label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                min="1"
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db'
                }}
              >
                <option value="UPI">UPI</option>
                <option value="Card">Debit/Credit Card</option>
                <option value="NetBanking">Net Banking</option>
              </select>
            </div>

            <Button
              onClick={handleAddMoney}
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: '#8b5cf6',
                color: 'white'
              }}
            >
              {loading ? 'Processing...' : 'Add Money'}
            </Button>
          </div>

          {/* Quick Add Amounts */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
              Quick Add
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[100, 250, 500, 1000].map(amount => (
                <Button
                  key={amount}
                  variant="outline"
                  onClick={() => setAddAmount(amount.toString())}
                  style={{ padding: '1rem' }}
                >
                  ₹{amount}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginTop: '2rem',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
              Transaction History ({transactions.length})
            </h3>
          </div>

          {transactions.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
              <p>No transactions yet</p>
            </div>
          ) : (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {transactions.map((txn, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '1rem 1.5rem',
                    borderBottom: idx < transactions.length - 1 ? '1px solid #f3f4f6' : 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: txn.type === 'CREDIT' ? '#d1fae5' : '#fee2e2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem'
                    }}>
                      {txn.type === 'CREDIT' ? '💰' : '💸'}
                    </div>
                    <div>
                      <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                        {txn.note}
                      </p>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {new Date(txn.date).toLocaleString()} • {txn.txnId}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{
                      fontWeight: 'bold',
                      fontSize: '1.125rem',
                      color: txn.type === 'CREDIT' ? '#10b981' : '#ef4444'
                    }}>
                      {txn.type === 'CREDIT' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {txn.source.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}