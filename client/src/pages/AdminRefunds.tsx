import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminSidebar from '@/components/AdminSidebar';
import { FaUndo, FaCheck, FaTimes, FaEye } from 'react-icons/fa';

export default function AdminRefunds() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRefund, setSelectedRefund] = useState<any>(null);

  const [refunds, setRefunds] = useState([
    { id: 'REF-001', student: 'Rahul Sharma', course: 'Python Basics', amount: 2124, reason: 'Course not as expected', date: '2024-01-20', status: 'Pending', invoiceId: 'INV-2024-001' },
    { id: 'REF-002', student: 'Priya Patel', course: 'Web Development', amount: 2950, reason: 'Technical issues', date: '2024-01-21', status: 'Approved', invoiceId: 'INV-2024-002' },
    { id: 'REF-003', student: 'Amit Kumar', course: 'Data Science', amount: 3540, reason: 'Duplicate payment', date: '2024-01-22', status: 'Pending', invoiceId: 'INV-2024-003' },
    { id: 'REF-004', student: 'Sneha Reddy', course: 'Machine Learning', amount: 4130, reason: 'Changed mind', date: '2024-01-23', status: 'Rejected', invoiceId: 'INV-2024-004' },
    { id: 'REF-005', student: 'Vikram Singh', course: 'React Masterclass', amount: 2596, reason: 'Quality concerns', date: '2024-01-24', status: 'Pending', invoiceId: 'INV-2024-005' }
  ]);

  const filteredRefunds = refunds.filter(ref => {
    const matchesSearch = ref.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ref.student.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ref.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (refundId: string) => {
    setRefunds(refunds.map(ref => 
      ref.id === refundId ? { ...ref, status: 'Approved' } : ref
    ));
  };

  const handleReject = (refundId: string) => {
    setRefunds(refunds.map(ref => 
      ref.id === refundId ? { ...ref, status: 'Rejected' } : ref
    ));
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return { bg: '#fef3c7', text: '#92400e' };
      case 'Approved': return { bg: '#d1fae5', text: '#065f46' };
      case 'Rejected': return { bg: '#fee2e2', text: '#991b1b' };
      default: return { bg: '#e5e7eb', text: '#374151' };
    }
  };

  const stats = {
    total: refunds.length,
    pending: refunds.filter(r => r.status === 'Pending').length,
    approved: refunds.filter(r => r.status === 'Approved').length,
    rejected: refunds.filter(r => r.status === 'Rejected').length,
    totalAmount: refunds.filter(r => r.status === 'Approved').reduce((sum, r) => sum + r.amount, 0)
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
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a1a1a' }}>Refunds & Chargebacks</h1>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            <Card>
              <CardHeader style={{ paddingBottom: '8px' }}>
                <CardTitle style={{ fontSize: '14px', color: '#666' }}>Total Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader style={{ paddingBottom: '8px' }}>
                <CardTitle style={{ fontSize: '14px', color: '#666' }}>Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>{stats.pending}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader style={{ paddingBottom: '8px' }}>
                <CardTitle style={{ fontSize: '14px', color: '#666' }}>Approved</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>{stats.approved}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader style={{ paddingBottom: '8px' }}>
                <CardTitle style={{ fontSize: '14px', color: '#666' }}>Rejected</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ef4444' }}>{stats.rejected}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader style={{ paddingBottom: '8px' }}>
                <CardTitle style={{ fontSize: '14px', color: '#666' }}>Refunded Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6' }}>₹{stats.totalAmount.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <CardTitle>Refund Requests</CardTitle>
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
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
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
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Refund ID</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Student</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Course</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Reason</th>
                      <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#666' }}>Amount</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Date</th>
                      <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#666' }}>Status</th>
                      <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#666' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRefunds.map((refund, idx) => {
                      const statusColor = getStatusColor(refund.status);
                      return (
                        <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                          <td style={{ padding: '12px', fontWeight: '600', color: '#8b5cf6' }}>{refund.id}</td>
                          <td style={{ padding: '12px' }}>{refund.student}</td>
                          <td style={{ padding: '12px' }}>{refund.course}</td>
                          <td style={{ padding: '12px', fontSize: '13px', color: '#666' }}>{refund.reason}</td>
                          <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>₹{refund.amount.toLocaleString()}</td>
                          <td style={{ padding: '12px' }}>{refund.date}</td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '600',
                              backgroundColor: statusColor.bg,
                              color: statusColor.text
                            }}>
                              {refund.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => setSelectedRefund(refund)}
                                title="View Details"
                              >
                                <FaEye />
                              </Button>
                              {refund.status === 'Pending' && (
                                <>
                                  <Button 
                                    size="sm" 
                                    style={{ backgroundColor: '#10b981', color: '#fff' }}
                                    onClick={() => handleApprove(refund.id)}
                                    title="Approve"
                                  >
                                    <FaCheck />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    style={{ backgroundColor: '#ef4444', color: '#fff' }}
                                    onClick={() => handleReject(refund.id)}
                                    title="Reject"
                                  >
                                    <FaTimes />
                                  </Button>
                                </>
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

          {selectedRefund && (
            <Card style={{ marginTop: '24px' }}>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <CardTitle>Refund Details - {selectedRefund.id}</CardTitle>
                  <Button size="sm" variant="outline" onClick={() => setSelectedRefund(null)}>Close</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#666' }}>Request Information</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div><span style={{ fontWeight: '600' }}>Refund ID:</span> {selectedRefund.id}</div>
                      <div><span style={{ fontWeight: '600' }}>Invoice ID:</span> {selectedRefund.invoiceId}</div>
                      <div><span style={{ fontWeight: '600' }}>Date:</span> {selectedRefund.date}</div>
                      <div><span style={{ fontWeight: '600' }}>Status:</span> <span style={{
                        padding: '2px 8px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: getStatusColor(selectedRefund.status).bg,
                        color: getStatusColor(selectedRefund.status).text
                      }}>{selectedRefund.status}</span></div>
                    </div>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#666' }}>Student & Course</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div><span style={{ fontWeight: '600' }}>Student:</span> {selectedRefund.student}</div>
                      <div><span style={{ fontWeight: '600' }}>Course:</span> {selectedRefund.course}</div>
                      <div><span style={{ fontWeight: '600' }}>Amount:</span> ₹{selectedRefund.amount.toLocaleString()}</div>
                      <div><span style={{ fontWeight: '600' }}>Reason:</span> {selectedRefund.reason}</div>
                    </div>
                  </div>
                </div>
                {selectedRefund.status === 'Pending' && (
                  <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <Button 
                      style={{ backgroundColor: '#10b981', color: '#fff' }}
                      onClick={() => {
                        handleApprove(selectedRefund.id);
                        setSelectedRefund(null);
                      }}
                    >
                      <FaCheck style={{ marginRight: '8px' }} /> Approve Refund
                    </Button>
                    <Button 
                      style={{ backgroundColor: '#ef4444', color: '#fff' }}
                      onClick={() => {
                        handleReject(selectedRefund.id);
                        setSelectedRefund(null);
                      }}
                    >
                      <FaTimes style={{ marginRight: '8px' }} /> Reject Refund
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
