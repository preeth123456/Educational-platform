import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import NewHeader from '../components/NewHeader';
import { TeacherSidebarDemo } from '../components/TeacherSidebar';
import { Scholarship, ScholarshipApplication, sampleScholarships } from '@/utils/promoMockData';
import { GraduationCap, Calendar, Users, FileText, CheckCircle, Clock, XCircle, Eye } from 'lucide-react';
import SessionManager from '../../utils/sessionManager';
import '../pages/TeacherDashboard.css';

export default function TeacherScholarships() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [applications, setApplications] = useState<ScholarshipApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<ScholarshipApplication | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewComment, setReviewComment] = useState('');

  const session = SessionManager.getSession();
  const teacherData = {
    name: session?.name || "Teacher",
    role: "Teacher",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  };

  useEffect(() => {
    setScholarships(sampleScholarships.filter(s => s.status === 'active'));
    
    const mockApplications: ScholarshipApplication[] = [
      {
        id: 'APP001',
        scholarshipId: 'SCH001',
        studentId: 'STU001',
        studentName: 'John Doe',
        applicationDate: '2024-01-15',
        status: 'pending',
        documents: ['transcript.pdf', 'income_cert.pdf']
      },
      {
        id: 'APP002',
        scholarshipId: 'SCH002',
        studentId: 'STU002',
        studentName: 'Jane Smith',
        applicationDate: '2024-01-16',
        status: 'pending',
        documents: ['transcript.pdf', 'recommendation.pdf']
      }
    ];
    setApplications(mockApplications);
  }, []);

  const handleReview = (action: 'approve' | 'reject') => {
    if (!selectedApplication) return;

    const updatedApplications = applications.map(app =>
      app.id === selectedApplication.id
        ? { ...app, status: action === 'approve' ? 'approved' : 'rejected' }
        : app
    );
    
    setApplications(updatedApplications);
    setShowReviewModal(false);
    setSelectedApplication(null);
    setReviewComment('');
    
    alert(`Application ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle size={16} style={{ color: '#10b981' }} />;
      case 'rejected': return <XCircle size={16} style={{ color: '#ef4444' }} />;
      default: return <Clock size={16} style={{ color: '#f59e0b' }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      default: return '#f59e0b';
    }
  };

  const pendingApplications = applications.filter(app => app.status === 'pending');

  return (
    <div className="dashboard-container">
      <TeacherSidebarDemo open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="dashboard-main" style={{ marginLeft: sidebarOpen ? "250px" : "60px" }}>
        <NewHeader
          avatar={teacherData.avatar}
          name={teacherData.name}
          role={teacherData.role}
          teacherId={session?.id}
          searchPlaceholder="Search..."
        />
        
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Scholarship Management
            </h1>
            <p style={{ color: '#6b7280' }}>
              Review and approve/reject student scholarship applications
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <Card>
              <CardContent style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ backgroundColor: '#8b5cf6', color: 'white', padding: '0.75rem', borderRadius: '50%' }}>
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Applications</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{applications.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ backgroundColor: '#f59e0b', color: 'white', padding: '0.75rem', borderRadius: '50%' }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Pending Review</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{pendingApplications.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card style={{ marginBottom: '2rem' }}>
            <CardHeader>
              <CardTitle>Pending Applications ({pendingApplications.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingApplications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                  <Clock size={32} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                  <p>No pending applications</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Student</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Scholarship</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Applied Date</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Documents</th>
                        <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingApplications.map((application) => {
                        const scholarship = scholarships.find(s => s.id === application.scholarshipId);
                        return (
                          <tr key={application.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                            <td style={{ padding: '12px' }}>
                              <div>
                                <p style={{ fontWeight: '600' }}>{application.studentName}</p>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{application.studentId}</p>
                              </div>
                            </td>
                            <td style={{ padding: '12px' }}>
                              <p style={{ fontWeight: '600' }}>{scholarship?.name}</p>
                            </td>
                            <td style={{ padding: '12px', fontSize: '0.875rem' }}>
                              {new Date(application.applicationDate).toLocaleDateString()}
                            </td>
                            <td style={{ padding: '12px', fontSize: '0.875rem' }}>
                              {application.documents.length} files
                            </td>
                            <td style={{ padding: '12px', textAlign: 'center' }}>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedApplication(application);
                                  setShowReviewModal(true);
                                }}
                              >
                                Review
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Student</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Scholarship</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Applied Date</th>
                      <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Status</th>
                      <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((application) => {
                      const scholarship = scholarships.find(s => s.id === application.scholarshipId);
                      return (
                        <tr key={application.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '12px' }}>
                            <div>
                              <p style={{ fontWeight: '600' }}>{application.studentName}</p>
                              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{application.studentId}</p>
                            </div>
                          </td>
                          <td style={{ padding: '12px' }}>
                            <p style={{ fontWeight: '600' }}>{scholarship?.name}</p>
                          </td>
                          <td style={{ padding: '12px', fontSize: '0.875rem' }}>
                            {new Date(application.applicationDate).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                              {getStatusIcon(application.status)}
                              <Badge style={{ backgroundColor: getStatusColor(application.status) + '20', color: getStatusColor(application.status) }}>
                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                              </Badge>
                            </div>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <Button size="sm" variant="outline">
                              <Eye size={16} />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {showReviewModal && selectedApplication && (
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
                maxWidth: '600px',
                width: '90%',
                maxHeight: '80vh',
                overflowY: 'auto'
              }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                  Review Application
                </h3>

                <div style={{ marginBottom: '1.5rem' }}>
                  <p><strong>Student:</strong> {selectedApplication.studentName} ({selectedApplication.studentId})</p>
                  <p><strong>Applied Date:</strong> {new Date(selectedApplication.applicationDate).toLocaleDateString()}</p>
                  <p><strong>Documents:</strong> {selectedApplication.documents.join(', ')}</p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Review Comments (Optional)
                  </label>
                  <Textarea
                    placeholder="Add your review comments..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={3}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <Button
                    onClick={() => setShowReviewModal(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleReview('reject')}
                    style={{ backgroundColor: '#ef4444', color: 'white' }}
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleReview('approve')}
                    style={{ backgroundColor: '#10b981', color: 'white' }}
                  >
                    Approve
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}