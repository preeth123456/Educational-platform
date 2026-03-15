import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminSidebar from '@/components/AdminSidebar';
import { FaFileInvoice, FaDownload, FaEye, FaPrint } from 'react-icons/fa';

export default function AdminInvoicing() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const invoices = [
    { id: 'INV-2024-001', student: 'Rahul Sharma', course: 'Python Basics', amount: 1800, gst: 324, total: 2124, date: '2024-01-15', status: 'Paid' },
    { id: 'INV-2024-002', student: 'Priya Patel', course: 'Web Development', amount: 2500, gst: 450, total: 2950, date: '2024-01-16', status: 'Paid' },
    { id: 'INV-2024-003', student: 'Amit Kumar', course: 'Data Science', amount: 3000, gst: 540, total: 3540, date: '2024-01-17', status: 'Pending' },
    { id: 'INV-2024-004', student: 'Sneha Reddy', course: 'Machine Learning', amount: 3500, gst: 630, total: 4130, date: '2024-01-18', status: 'Paid' },
    { id: 'INV-2024-005', student: 'Vikram Singh', course: 'React Masterclass', amount: 2200, gst: 396, total: 2596, date: '2024-01-19', status: 'Paid' }
  ];

  const filteredInvoices = invoices.filter(inv => 
    inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.student.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const viewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
  };

  const downloadInvoice = (invoice: any) => {
    window.print();
  };

  const generateInvoice = () => {
    alert('Generate new invoice form would open here');
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
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a1a1a' }}>Invoicing & Tax (GST) Management</h1>
            <Button onClick={generateInvoice} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaFileInvoice /> Generate Invoice
            </Button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            <Card>
              <CardHeader style={{ paddingBottom: '8px' }}>
                <CardTitle style={{ fontSize: '14px', color: '#666' }}>Total Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{invoices.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader style={{ paddingBottom: '8px' }}>
                <CardTitle style={{ fontSize: '14px', color: '#666' }}>Total Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>₹{invoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader style={{ paddingBottom: '8px' }}>
                <CardTitle style={{ fontSize: '14px', color: '#666' }}>Total GST (18%)</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>₹{invoices.reduce((sum, inv) => sum + inv.gst, 0).toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader style={{ paddingBottom: '8px' }}>
                <CardTitle style={{ fontSize: '14px', color: '#666' }}>Grand Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6' }}>₹{invoices.reduce((sum, inv) => sum + inv.total, 0).toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          <Card style={{ marginBottom: '24px' }}>
            <CardHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <CardTitle>Invoice List</CardTitle>
                <Input 
                  placeholder="Search by invoice ID or student..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ maxWidth: '300px' }}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Invoice ID</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Student</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Course</th>
                      <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#666' }}>Amount</th>
                      <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#666' }}>GST (18%)</th>
                      <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#666' }}>Total</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Date</th>
                      <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#666' }}>Status</th>
                      <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#666' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.map((invoice, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '12px', fontWeight: '600', color: '#8b5cf6' }}>{invoice.id}</td>
                        <td style={{ padding: '12px' }}>{invoice.student}</td>
                        <td style={{ padding: '12px' }}>{invoice.course}</td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>₹{invoice.amount.toLocaleString()}</td>
                        <td style={{ padding: '12px', textAlign: 'right', color: '#f59e0b' }}>₹{invoice.gst.toLocaleString()}</td>
                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>₹{invoice.total.toLocaleString()}</td>
                        <td style={{ padding: '12px' }}>{invoice.date}</td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            backgroundColor: invoice.status === 'Paid' ? '#d1fae5' : '#fef3c7',
                            color: invoice.status === 'Paid' ? '#065f46' : '#92400e'
                          }}>
                            {invoice.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <Button size="sm" variant="outline" onClick={() => viewInvoice(invoice)}>
                              <FaEye />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => downloadInvoice(invoice)}>
                              <FaDownload />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {selectedInvoice && (
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <CardTitle>Invoice Preview - {selectedInvoice.id}</CardTitle>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button size="sm" onClick={() => window.print()}>
                      <FaPrint /> Print
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setSelectedInvoice(null)}>
                      Close
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div style={{ padding: '24px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#fff' }}>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>EDUYATA</h2>
                    <p style={{ fontSize: '12px', color: '#666' }}>Learning Management System</p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                    <div>
                      <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Bill To:</h3>
                      <p style={{ fontSize: '14px', margin: '4px 0' }}>{selectedInvoice.student}</p>
                      <p style={{ fontSize: '12px', color: '#666' }}>Student ID: STU-{Math.floor(Math.random() * 1000)}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Invoice Details:</h3>
                      <p style={{ fontSize: '14px', margin: '4px 0' }}>Invoice: {selectedInvoice.id}</p>
                      <p style={{ fontSize: '12px', color: '#666' }}>Date: {selectedInvoice.date}</p>
                      <p style={{ fontSize: '12px', color: '#666' }}>GSTIN: 29ABCDE1234F1Z5</p>
                    </div>
                  </div>

                  <table style={{ width: '100%', marginBottom: '24px', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Description</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '12px' }}>{selectedInvoice.course}</td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>₹{selectedInvoice.amount.toLocaleString()}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '12px', fontWeight: '600' }}>GST (18%)</td>
                        <td style={{ padding: '12px', textAlign: 'right', color: '#f59e0b' }}>₹{selectedInvoice.gst.toLocaleString()}</td>
                      </tr>
                      <tr style={{ backgroundColor: '#f9fafb' }}>
                        <td style={{ padding: '12px', fontWeight: '700', fontSize: '16px' }}>Total Amount</td>
                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: '700', fontSize: '16px', color: '#8b5cf6' }}>₹{selectedInvoice.total.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div style={{ fontSize: '12px', color: '#666', textAlign: 'center', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                    <p>Thank you for your business!</p>
                    <p>For queries, contact: support@eduyata.com | +91-1234567890</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
