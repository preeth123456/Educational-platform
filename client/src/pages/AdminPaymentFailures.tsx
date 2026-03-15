import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminSidebar from '@/components/AdminSidebar';
import { FaExclamationTriangle, FaRedo, FaEnvelope, FaBan } from 'react-icons/fa';

export default function AdminPaymentFailures() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [failures, setFailures] = useState([
    { id: 'PAY-F001', student: 'Rahul Sharma', course: 'Python Basics', amount: 2124, reason: 'Insufficient funds', date: '2024-01-25', retries: 2, status: 'Failed', lastRetry: '2024-01-26' },
    { id: 'PAY-F002', student: 'Priya Patel', course: 'Web Development', amount: 2950, reason: 'Card expired', date: '2024-01-25', retries: 1, status: 'Pending Retry', lastRetry: '2024-01-25' },
    { id: 'PAY-F003', student: 'Amit Kumar', course: 'Data Science', amount: 3540, reason: 'Payment gateway error', date: '2024-01-26', retries: 3, status: 'Failed', lastRetry: '2024-01-27' },
    { id: 'PAY-F004', student: 'Sneha Reddy', course: 'Machine Learning', amount: 4130, reason: 'Bank declined', date: '2024-01-26', retries: 0, status: 'Pending Retry', lastRetry: '-' },
    { id: 'PAY-F005', student: 'Vikram Singh', course: 'React Masterclass', amount: 2596, reason: 'Invalid card', date: '2024-01-27', retries: 2, status: 'Cancelled', lastRetry: '2024-01-28' }
  ]);

  const filteredFailures = failures.filter(fail => {
    const matchesSearch = fail.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fail.student.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || fail.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRetry = (id: string) => {
    setFailures(failures.map(f => 
      f.id === id ? { ...f, retries: f.retries + 1, lastRetry: new Date().toISOString().split('T')[0], status: 'Pending Retry' } : f
    ));
    alert('Payment retry initiated!');
  };

  const handleSendReminder = (id: string) => {
    alert('Reminder email sent to student!');
  };

  const handleCancel = (id: string) => {
    setFailures(failures.map(f => 
      f.id === id ? { ...f, status: 'Cancelled' } : f
    ));
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Failed': return { bg: '#fee2e2', text: '#991b1b' };
      case 'Pending Retry': return { bg: '#fef3c7', text: '#92400e' };
      case 'Cancelled': return { bg: '#e5e7eb', text: '#374151' };
      default: return { bg: '#e5e7eb', text: '#374151' };
    }
  };

  const stats = {
    total: failures.length,
    failed: failures.filter(f => f.status === 'Failed').length,
    pendingRetry: failures.filter(f => f.status === 'Pending Retry').length,
    cancelled: failures.filter(f => f.status === 'Cancelled').length,
    totalAmount: failures.reduce((sum, f) => sum + f.amount, 0)
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div style={{ 
        flex: 1, 
        marginLeft: sidebarOpen ? '250px' : '60px',
        transition: 'margin-left 0.3s ease',
        padding: '24px'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a1a1a' }}>Payment Failure, Retry & Dunning</h1>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            <Card>
              <CardHeader style={{ paddingBottom: '8px' }}>
                <CardTitle style={{ fontSize: '14px', color: '#666' }}>Total Failures</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ef4444' }}>{stats.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader style={{ paddingBottom: '8px' }}>
                <CardTitle style={{ fontSize: '14px', color: '#666' }}>Failed</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc2626' }}>{stats.failed}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader style={{ paddingBottom: '8px' }}>
                <CardTitle style={{ fontSize: '14px', color: '#666' }}>Pending Retry</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>{stats.pendingRetry}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader style={{ paddingBottom: '8px' }}>
                <CardTitle style={{ fontSize: '14px', color: '#666' }}>Cancelled</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#6b7280' }}>{stats.cancelled}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader style={{ paddingBottom: '8px' }}>
                <CardTitle style={{ fontSize: '14px', color: '#666' }}>Lost Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6' }}>₹{stats.totalAmount.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <CardTitle>Failed Payments</CardTitle>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Input 
                    placeholder="Search..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ maxWidth: '250px' }}
                  />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger style={{ width: '150px' }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Failed">Failed</SelectItem>
                      <SelectItem value="Pending Retry">Pending Retry</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Payment ID</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Student</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Course</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Reason</th>
                      <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#666' }}>Amount</th>
                      <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#666' }}>Retries</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Last Retry</th>
                      <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#666' }}>Status</th>
                      <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#666' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFailures.map((failure, idx) => {
                      const statusColor = getStatusColor(failure.status);
                      return (
                        <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                          <td style={{ padding: '12px', fontWeight: '600', color: '#8b5cf6' }}>{failure.id}</td>
                          <td style={{ padding: '12px' }}>{failure.student}</td>
                          <td style={{ padding: '12px' }}>{failure.course}</td>
                          <td style={{ padding: '12px', fontSize: '13px', color: '#666' }}>{failure.reason}</td>
                          <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>₹{failure.amount.toLocaleString()}</td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '600',
                              backgroundColor: failure.retries >= 3 ? '#fee2e2' : '#e0e7ff',
                              color: failure.retries >= 3 ? '#991b1b' : '#3730a3'
                            }}>
                              {failure.retries}/3
                            </span>
                          </td>
                          <td style={{ padding: '12px', fontSize: '13px' }}>{failure.lastRetry}</td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '600',
                              backgroundColor: statusColor.bg,
                              color: statusColor.text
                            }}>
                              {failure.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              {failure.status !== 'Cancelled' && failure.retries < 3 && (
                                <>
                                  <Button 
                                    size="sm" 
                                    style={{ backgroundColor: '#3b82f6', color: '#fff' }}
                                    onClick={() => handleRetry(failure.id)}
                                    title="Retry Payment"
                                  >
                                    <FaRedo />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    style={{ backgroundColor: '#f59e0b', color: '#fff' }}
                                    onClick={() => handleSendReminder(failure.id)}
                                    title="Send Reminder"
                                  >
                                    <FaEnvelope />
                                  </Button>
                                </>
                              )}
                              {failure.status !== 'Cancelled' && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleCancel(failure.id)}
                                  title="Cancel"
                                >
                                  <FaBan />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card style={{ marginTop: '24px' }}>
            <CardHeader>
              <CardTitle>Dunning Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Auto-Retry Settings</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Max Retries:</span>
                      <span style={{ fontWeight: '600' }}>3 attempts</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Retry Interval:</span>
                      <span style={{ fontWeight: '600' }}>24 hours</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Auto-Cancel After:</span>
                      <span style={{ fontWeight: '600' }}>7 days</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Email Reminders</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>First Reminder:</span>
                      <span style={{ fontWeight: '600' }}>Immediately</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Second Reminder:</span>
                      <span style={{ fontWeight: '600' }}>After 3 days</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Final Notice:</span>
                      <span style={{ fontWeight: '600' }}>After 6 days</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
