import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, Download, RefreshCw, DollarSign, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { FaReceipt } from 'react-icons/fa';

interface Transaction {
  id: number;
  invoiceNumber: string;
  studentId: number;
  studentName: string;
  amount: number;
  gst: number;
  totalAmount: number;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
  date: string;
  courseTitle: string;
}

export default function AdminBillingConsole() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = transactions.filter(
        (t) =>
          t.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.studentId.toString().includes(searchTerm)
      );
      setFilteredTransactions(filtered);
    } else {
      setFilteredTransactions(transactions);
    }
  }, [searchTerm, transactions]);

  const loadTransactions = async () => {
    setLoading(true);
    
    // Mock data - replace with API call later
    const mockTransactions: Transaction[] = [
      {
        id: 1,
        invoiceNumber: 'INV-2026-001',
        studentId: 26,
        studentName: 'Swathi',
        amount: 693,
        gst: 124.74,
        totalAmount: 817.74,
        status: 'paid',
        paymentMethod: 'UPI',
        date: '2026-01-15',
        courseTitle: 'Advanced Mathematics'
      },
      {
        id: 2,
        invoiceNumber: 'INV-2026-002',
        studentId: 27,
        studentName: 'Rahul Kumar',
        amount: 495,
        gst: 89.10,
        totalAmount: 584.10,
        status: 'paid',
        paymentMethod: 'Credit Card',
        date: '2026-01-14',
        courseTitle: 'Physics Fundamentals'
      },
      {
        id: 3,
        invoiceNumber: 'INV-2026-003',
        studentId: 28,
        studentName: 'Priya Sharma',
        amount: 297,
        gst: 53.46,
        totalAmount: 350.46,
        status: 'pending',
        paymentMethod: 'Net Banking',
        date: '2026-01-13',
        courseTitle: 'Chemistry Basics'
      },
      {
        id: 4,
        invoiceNumber: 'INV-2026-004',
        studentId: 29,
        studentName: 'Amit Patel',
        amount: 891,
        gst: 160.38,
        totalAmount: 1051.38,
        status: 'failed',
        paymentMethod: 'Debit Card',
        date: '2026-01-12',
        courseTitle: 'Computer Science'
      },
      {
        id: 5,
        invoiceNumber: 'INV-2026-005',
        studentId: 30,
        studentName: 'Sneha Reddy',
        amount: 198,
        gst: 35.64,
        totalAmount: 233.64,
        status: 'refunded',
        paymentMethod: 'UPI',
        date: '2026-01-11',
        courseTitle: 'Biology Essentials'
      }
    ];

    setTimeout(() => {
      setTransactions(mockTransactions);
      setFilteredTransactions(mockTransactions);
      setLoading(false);
    }, 500);
  };

  const handleExport = () => {
    const csv = [
      ['Invoice No', 'Student ID', 'Student Name', 'Course', 'Amount', 'GST', 'Total', 'Status', 'Payment Method', 'Date'],
      ...filteredTransactions.map((t) => [
        t.invoiceNumber,
        t.studentId,
        t.studentName,
        t.courseTitle,
        t.amount.toFixed(2),
        t.gst.toFixed(2),
        t.totalAmount.toFixed(2),
        t.status,
        t.paymentMethod,
        t.date
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `billing-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const totalRevenue = filteredTransactions
    .filter(t => t.status === 'paid')
    .reduce((sum, t) => sum + t.totalAmount, 0);
  
  const pendingAmount = filteredTransactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.totalAmount, 0);
  
  const failedCount = filteredTransactions.filter(t => t.status === 'failed').length;
  const paidCount = filteredTransactions.filter(t => t.status === 'paid').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="dashboard-main" style={{ paddingTop: '80px' }}>
        <div className="dashboard-content">
          {/* Header */}
          <div className="hero-welcome">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">Billing & Payments Console</h1>
                <p className="hero-subtitle one-line">Manage invoices, transactions, and payment records</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button onClick={loadTransactions} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="stats-grid" style={{ marginTop: '2rem' }}>
            <div className="stat-card primary">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                <DollarSign />
              </div>
              <div className="stat-content">
                <h3>₹{totalRevenue.toFixed(2)}</h3>
                <p>Total Revenue</p>
                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#e5e7eb', borderRadius: '0.375rem', overflow: 'hidden' }}>
                    <div style={{ width: '92%', height: '100%', background: 'linear-gradient(90deg, #22c55e, #16a34a)', borderRadius: '0.375rem', transition: 'width 0.25s ease-in-out' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="stat-card success">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                <CheckCircle />
              </div>
              <div className="stat-content">
                <h3>{paidCount}</h3>
                <p>Paid Transactions</p>
                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#e5e7eb', borderRadius: '0.375rem', overflow: 'hidden' }}>
                    <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg, #3b82f6, #2563eb)', borderRadius: '0.375rem', transition: 'width 0.25s ease-in-out' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="stat-card info">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                <FileText />
              </div>
              <div className="stat-content">
                <h3>₹{pendingAmount.toFixed(2)}</h3>
                <p>Pending Amount</p>
                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#e5e7eb', borderRadius: '0.375rem', overflow: 'hidden' }}>
                    <div style={{ width: '45%', height: '100%', background: 'linear-gradient(90deg, #f59e0b, #d97706)', borderRadius: '0.375rem', transition: 'width 0.25s ease-in-out' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="stat-card warning">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                <AlertCircle />
              </div>
              <div className="stat-content">
                <h3>{failedCount}</h3>
                <p>Failed Payments</p>
                <div style={{ marginTop: '0.75rem' }}>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#e5e7eb', borderRadius: '0.375rem', overflow: 'hidden' }}>
                    <div style={{ width: '20%', height: '100%', background: 'linear-gradient(90deg, #ef4444, #dc2626)', borderRadius: '0.375rem', transition: 'width 0.25s ease-in-out' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="dashboard-section" style={{ marginTop: '2rem' }}>
            <div className="section-header">
              <div className="section-title">
                <FaReceipt className="section-icon" />
                <h2>All Transactions</h2>
              </div>
            </div>
            <div style={{ padding: '1rem' }}>
              <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#9ca3af' }} />
                <Input
                  placeholder="Search by invoice, student name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading transactions...</p>
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  No transactions found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Invoice No</th>
                        <th className="text-left p-3">Student</th>
                        <th className="text-left p-3">Course</th>
                        <th className="text-right p-3">Amount</th>
                        <th className="text-right p-3">GST (18%)</th>
                        <th className="text-right p-3">Total</th>
                        <th className="text-center p-3">Status</th>
                        <th className="text-left p-3">Payment</th>
                        <th className="text-left p-3">Date</th>
                        <th className="text-center p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{transaction.invoiceNumber}</td>
                          <td className="p-3">
                            <div>{transaction.studentName}</div>
                            <div className="text-xs text-gray-500">ID: {transaction.studentId}</div>
                          </td>
                          <td className="p-3 text-sm">{transaction.courseTitle}</td>
                          <td className="text-right p-3">₹{transaction.amount.toFixed(2)}</td>
                          <td className="text-right p-3 text-gray-600">₹{transaction.gst.toFixed(2)}</td>
                          <td className="text-right p-3 font-semibold">₹{transaction.totalAmount.toFixed(2)}</td>
                          <td className="text-center p-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(transaction.status)}`}>
                              {transaction.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-3 text-sm">{transaction.paymentMethod}</td>
                          <td className="p-3 text-sm">{new Date(transaction.date).toLocaleDateString()}</td>
                          <td className="text-center p-3">
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
