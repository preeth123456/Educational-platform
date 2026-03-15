import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import StudentLayout from '@/components/StudentLayout';
import SessionManager from '@/utils/sessionManager';
import { FaFileInvoice, FaDownload, FaEye, FaPrint, FaReceipt, FaMoneyBillWave, FaClock } from 'react-icons/fa';

export default function StudentBilling() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [studentSession] = useState(SessionManager.getSession());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  // Load invoices from localStorage (from payment system) and merge with existing mock data
  const loadInvoices = () => {
    const storedInvoices = JSON.parse(localStorage.getItem('student_invoices') || '[]');
    const mockInvoices = [
      { id: 'INV-2024-001', course: 'Python Basics', amount: 1800, gst: 324, total: 2124, date: '2024-01-15', status: 'Paid' },
      { id: 'INV-2024-002', course: 'Web Development', amount: 2500, gst: 450, total: 2950, date: '2024-01-16', status: 'Paid' },
      { id: 'INV-2024-003', course: 'Data Science', amount: 3000, gst: 540, total: 3540, date: '2024-01-17', status: 'Pending' }
    ];
    
    // Convert stored invoices to match the expected format
    const convertedStoredInvoices = storedInvoices.map((invoice: any) => ({
      id: invoice.invoiceId || invoice.id,
      course: invoice.planId ? invoice.planId.charAt(0).toUpperCase() + invoice.planId.slice(1) + ' Plan' : 'Unknown Plan',
      amount: Math.round(invoice.amount / 1.18), // Remove GST to get base amount
      gst: Math.round(invoice.amount * 0.18 / 1.18), // Calculate GST
      total: invoice.amount,
      date: new Date(invoice.createdAt).toLocaleDateString('en-IN'),
      status: invoice.status === 'PAID' ? 'Paid' : invoice.status
    }));
    
    return [...convertedStoredInvoices, ...mockInvoices];
  };
  
  const [invoices, setInvoices] = useState(loadInvoices());
  
  // Refresh invoices when component mounts or localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setInvoices(loadInvoices());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const filteredInvoices = invoices.filter(inv => 
    inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.course.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Show message if no invoices
  const hasInvoices = filteredInvoices.length > 0;

  const downloadInvoice = (invoice: any) => {
    const receiptContent = `
EDUYATA - Invoice Receipt
========================

Invoice ID: ${invoice.id}
Plan: ${invoice.course}
Amount: ₹${invoice.amount.toLocaleString()}
GST (18%): ₹${invoice.gst.toLocaleString()}
Total: ₹${invoice.total.toLocaleString()}
Status: ${invoice.status}
Date: ${invoice.date}

Student: ${studentSession?.name || 'Student Name'}
Student ID: STU-${studentSession?.id || '001'}

Thank you for your payment!
For support: support@eduyata.com
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${invoice.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Receipt Downloaded",
      description: `Receipt for ${invoice.id} has been downloaded successfully.`
    });
  };

  const openInvoiceModal = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  return (
    <StudentLayout>
      <div className="dashboard-main" style={{ paddingTop: '80px' }}>
        <div className="dashboard-content">
          {/* Hero Welcome Section */}
          <div className="hero-welcome">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">My Invoices & Receipts</h1>
                <p className="hero-subtitle one-line">View and download your payment invoices and receipts</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid" style={{ marginTop: '2rem' }}>
            <div className="stat-card success">
              <div className="stat-icon">
                <FaMoneyBillWave />
              </div>
              <div className="stat-content">
                <h3>₹{invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.total, 0).toLocaleString()}</h3>
                <p>Total Paid</p>
              </div>
            </div>

            <div className="stat-card warning">
              <div className="stat-icon">
                <FaClock />
              </div>
              <div className="stat-content">
                <h3>₹{invoices.filter(i => i.status === 'Pending').reduce((sum, i) => sum + i.total, 0).toLocaleString()}</h3>
                <p>Pending</p>
              </div>
            </div>

            <div className="stat-card primary">
              <div className="stat-icon">
                <FaReceipt />
              </div>
              <div className="stat-content">
                <h3>{invoices.length}</h3>
                <p>Total Invoices</p>
              </div>
            </div>
          </div>

          {/* Invoice List */}
          <div className="dashboard-section" style={{ marginTop: '2rem' }}>
            <div className="section-header">
              <div className="section-title">
                <FaReceipt className="section-icon" />
                <h2>Invoice History</h2>
              </div>
              <Input 
                placeholder="Search invoices..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ maxWidth: '300px' }}
              />
            </div>
            <div style={{ padding: '1rem', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#666' }}>Invoice ID</th>
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
                  {!hasInvoices ? (
                    <tr>
                      <td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                        No invoices yet
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((invoice, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '12px', fontWeight: '600', color: '#8b5cf6' }}>{invoice.id}</td>
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
                            <Button size="sm" variant="outline" onClick={() => openInvoiceModal(invoice)}>
                              <FaEye />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => downloadInvoice(invoice)}>
                              <FaDownload />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Invoice Detail Modal */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Invoice Details - {selectedInvoice?.id}</DialogTitle>
              </DialogHeader>
              
              {selectedInvoice && (
                <div style={{ padding: '1rem 0' }}>
                  <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280', fontWeight: '500' }}>Invoice ID:</span>
                      <span style={{ fontWeight: '600', color: '#8b5cf6' }}>{selectedInvoice.id}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280', fontWeight: '500' }}>Plan Name:</span>
                      <span style={{ fontWeight: '600' }}>{selectedInvoice.course}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280', fontWeight: '500' }}>Amount:</span>
                      <span style={{ fontWeight: '600' }}>₹{selectedInvoice.amount.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280', fontWeight: '500' }}>GST (18%):</span>
                      <span style={{ fontWeight: '600', color: '#f59e0b' }}>₹{selectedInvoice.gst.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e5e7eb', paddingTop: '0.5rem' }}>
                      <span style={{ color: '#6b7280', fontWeight: '500' }}>Total Amount:</span>
                      <span style={{ fontWeight: '700', fontSize: '1.25rem', color: '#8b5cf6' }}>₹{selectedInvoice.total.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280', fontWeight: '500' }}>Status:</span>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: selectedInvoice.status === 'Paid' ? '#d1fae5' : '#fef3c7',
                        color: selectedInvoice.status === 'Paid' ? '#065f46' : '#92400e'
                      }}>
                        {selectedInvoice.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280', fontWeight: '500' }}>Date:</span>
                      <span style={{ fontWeight: '600' }}>{selectedInvoice.date}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button
                  onClick={() => selectedInvoice && downloadInvoice(selectedInvoice)}
                  style={{
                    backgroundColor: '#8b5cf6',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <FaDownload />
                  Download Receipt
                </Button>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {selectedInvoice && !isModalOpen && (
            <div className="dashboard-section" style={{ marginTop: '2rem' }}>
              <div className="section-header">
                <div className="section-title">
                  <FaFileInvoice className="section-icon" />
                  <h2>Invoice - {selectedInvoice.id}</h2>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button size="sm" onClick={() => window.print()}>
                    <FaPrint /> Print
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setSelectedInvoice(null)}>
                    Close
                  </Button>
                </div>
              </div>
              <div style={{ padding: '2rem' }}>
                <div style={{ padding: '24px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#fff' }}>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>EDUYATA</h2>
                    <p style={{ fontSize: '12px', color: '#666' }}>Learning Management System</p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                    <div>
                      <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Bill To:</h3>
                      <p style={{ fontSize: '14px', margin: '4px 0' }}>{studentSession?.name || 'Student Name'}</p>
                      <p style={{ fontSize: '12px', color: '#666' }}>Student ID: STU-{studentSession?.id || '001'}</p>
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
              </div>
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
