import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import StudentLayout from '@/components/StudentLayout';
import { Scholarship, ScholarshipApplication, sampleScholarships } from '@/utils/promoMockData';
import { GraduationCap, Calendar, Users, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function StudentScholarships() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [applications, setApplications] = useState<ScholarshipApplication[]>([]);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [applicationForm, setApplicationForm] = useState({
    reason: '',
    documents: [] as string[]
  });
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  useEffect(() => {
    setScholarships(sampleScholarships.filter(s => s.status === 'active'));
    const storedApps = localStorage.getItem('scholarship_applications');
    if (storedApps) {
      setApplications(JSON.parse(storedApps));
    }
  }, []);

  const submitApplication = () => {
    if (!selectedScholarship) return;

    const newApplication: ScholarshipApplication = {
      id: `APP${Date.now()}`,
      scholarshipId: selectedScholarship.id,
      studentId: 'STU001', // Mock student ID
      studentName: 'Current Student',
      applicationDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      documents: applicationForm.documents
    };

    const updatedApplications = [...applications, newApplication];
    setApplications(updatedApplications);
    localStorage.setItem('scholarship_applications', JSON.stringify(updatedApplications));

    setShowApplicationModal(false);
    setApplicationForm({ reason: '', documents: [] });
    alert('Application submitted successfully!');
  };

  const getApplicationStatus = (scholarshipId: string) => {
    return applications.find(app => app.scholarshipId === scholarshipId && app.studentId === 'STU001');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle size={16} className="text-green-600" />;
      case 'rejected': return <XCircle size={16} className="text-red-600" />;
      default: return <Clock size={16} className="text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      default: return '#f59e0b';
    }
  };

  return (
    <StudentLayout>
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Scholarship Programs
          </h1>
          <p style={{ color: '#6b7280' }}>
            Apply for scholarships to get financial assistance and benefits
          </p>
        </div>

        {/* My Applications Summary */}
        {applications.length > 0 && (
          <Card style={{ marginBottom: '2rem' }}>
            <CardHeader>
              <CardTitle>My Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {applications.map(app => {
                  const scholarship = scholarships.find(s => s.id === app.scholarshipId);
                  return (
                    <div key={app.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '8px'
                    }}>
                      {getStatusIcon(app.status)}
                      <span style={{ fontSize: '0.875rem' }}>
                        {scholarship?.name} - {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Scholarships */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
          {scholarships.length === 0 ? (
            <Card style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                No scholarships available
              </h3>
              <p style={{ color: '#6b7280' }}>
                Check back later for new scholarship opportunities
              </p>
            </Card>
          ) : (
            scholarships.map((scholarship) => {
              const application = getApplicationStatus(scholarship.id);
              return (
                <Card key={scholarship.id} style={{ border: '2px solid #e5e7eb' }}>
                  <CardContent style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                          {scholarship.name}
                        </h3>
                        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
                          {scholarship.description}
                        </p>
                      </div>
                      <div style={{
                        backgroundColor: '#8b5cf6',
                        color: 'white',
                        padding: '0.5rem',
                        borderRadius: '50%'
                      }}>
                        <GraduationCap size={16} />
                      </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Benefits:</h4>
                      <ul style={{ fontSize: '0.875rem', color: '#6b7280', paddingLeft: '1rem' }}>
                        {scholarship.benefits.map((benefit, idx) => (
                          <li key={idx}>{benefit}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Eligibility:</h4>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {scholarship.eligibilityCriteria}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={14} />
                        <span>Deadline: {new Date(scholarship.applicationDeadline).toLocaleDateString()}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Users size={14} />
                        <span>{scholarship.maxBeneficiaries - scholarship.currentBeneficiaries} spots left</span>
                      </div>
                    </div>

                    {application ? (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem',
                        backgroundColor: getStatusColor(application.status) + '20',
                        borderRadius: '8px',
                        border: `1px solid ${getStatusColor(application.status)}40`
                      }}>
                        {getStatusIcon(application.status)}
                        <span style={{ fontWeight: '600', color: getStatusColor(application.status) }}>
                          Application {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </div>
                    ) : (
                      <Button
                        onClick={() => {
                          setSelectedScholarship(scholarship);
                          setShowApplicationModal(true);
                        }}
                        style={{ width: '100%' }}
                      >
                        Apply Now
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Application Modal */}
        {showApplicationModal && selectedScholarship && (
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
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                Apply for {selectedScholarship.name}
              </h3>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Why do you deserve this scholarship?
                </label>
                <Textarea
                  placeholder="Explain your reasons..."
                  value={applicationForm.reason}
                  onChange={(e) => setApplicationForm(prev => ({ ...prev, reason: e.target.value }))}
                  rows={4}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Required Documents (Mock)
                </label>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  <p>• Academic transcripts</p>
                  <p>• Income certificate (if applicable)</p>
                  <p>• Identity proof</p>
                  <p style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>
                    Note: This is a demo. In real implementation, file upload would be here.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <Button
                  onClick={() => setShowApplicationModal(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button onClick={submitApplication}>
                  Submit Application
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}