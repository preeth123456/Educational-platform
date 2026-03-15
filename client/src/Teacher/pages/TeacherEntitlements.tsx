import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import NewHeader from '../components/NewHeader';
import { TeacherSidebarDemo } from '../components/TeacherSidebar';
import { entitlementService } from '@/utils/entitlementService';
import { Entitlement } from '@/utils/promoMockData';
import { Search, Crown, Wallet, GraduationCap, Gift, Users, Shield, Eye } from 'lucide-react';
import SessionManager from '../../utils/sessionManager';
import '../pages/TeacherDashboard.css';

export default function TeacherEntitlements() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [entitlements, setEntitlements] = useState<Entitlement[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const session = SessionManager.getSession();
  const teacherData = {
    name: session?.name || "Teacher",
    role: "Teacher",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  };

  useEffect(() => {
    loadEntitlements();
  }, []);

  const loadEntitlements = () => {
    const allEntitlements = entitlementService.getAllEntitlements();
    setEntitlements(allEntitlements);
  };

  const getEntitlementIcon = (type: string) => {
    switch (type) {
      case 'PLAN_ACCESS': return <Crown size={16} />;
      case 'WALLET_CREDITS': return <Wallet size={16} />;
      case 'COURSE_UNLOCK': return <GraduationCap size={16} />;
      case 'PREMIUM_FEATURES': return <Shield size={16} />;
      default: return <Gift size={16} />;
    }
  };

  const getEntitlementColor = (type: string) => {
    switch (type) {
      case 'PLAN_ACCESS': return '#8b5cf6';
      case 'WALLET_CREDITS': return '#10b981';
      case 'COURSE_UNLOCK': return '#f59e0b';
      case 'PREMIUM_FEATURES': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const filteredEntitlements = entitlements.filter(entitlement => {
    const matchesSearch = entitlement.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entitlement.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || entitlement.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const activeEntitlements = entitlements.filter(e => e.isActive).length;
  const uniqueStudents = new Set(entitlements.map(e => e.studentId)).size;

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
        
        <div style={{ padding: '2rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Student Entitlements (View Only)
            </h1>
            <p style={{ color: '#6b7280' }}>
              View student access rights and entitlements
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <Card>
              <CardContent style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ backgroundColor: '#8b5cf6', color: 'white', padding: '0.75rem', borderRadius: '50%' }}>
                    <Shield size={20} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Entitlements</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{entitlements.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ backgroundColor: '#10b981', color: 'white', padding: '0.75rem', borderRadius: '50%' }}>
                    <Gift size={20} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Active Entitlements</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{activeEntitlements}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ backgroundColor: '#f59e0b', color: 'white', padding: '0.75rem', borderRadius: '50%' }}>
                    <Users size={20} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Students with Access</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{uniqueStudents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card style={{ marginBottom: '2rem' }}>
            <CardContent style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '1rem', alignItems: 'end' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Search Entitlements
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                    <Input
                      placeholder="Search by student ID or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ paddingLeft: '40px' }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Type
                  </label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="PLAN_ACCESS">Plan Access</SelectItem>
                      <SelectItem value="WALLET_CREDITS">Wallet Credits</SelectItem>
                      <SelectItem value="COURSE_UNLOCK">Course Unlock</SelectItem>
                      <SelectItem value="PREMIUM_FEATURES">Premium Features</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Student Entitlements ({filteredEntitlements.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Student ID</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Type</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Value</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Description</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Granted By</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Expires</th>
                      <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEntitlements.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                          <Shield size={32} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                          <p>No entitlements found</p>
                          <p style={{ fontSize: '0.875rem' }}>Students will appear here when they have entitlements</p>
                        </td>
                      </tr>
                    ) : (
                      filteredEntitlements.map((entitlement) => (
                        <tr key={entitlement.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '12px', fontWeight: '600', color: '#8b5cf6' }}>
                            {entitlement.studentId}
                          </td>
                          <td style={{ padding: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div style={{ color: getEntitlementColor(entitlement.type) }}>
                                {getEntitlementIcon(entitlement.type)}
                              </div>
                              <span style={{ fontSize: '0.875rem' }}>
                                {entitlement.type.replace('_', ' ')}
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '12px', fontWeight: '600' }}>
                            {entitlement.type === 'WALLET_CREDITS' ? `₹${entitlement.value}` : entitlement.value}
                          </td>
                          <td style={{ padding: '12px', fontSize: '0.875rem' }}>
                            {entitlement.description}
                          </td>
                          <td style={{ padding: '12px', fontSize: '0.875rem' }}>
                            {entitlement.grantedBy}
                          </td>
                          <td style={{ padding: '12px', fontSize: '0.875rem' }}>
                            {entitlement.expiresAt ? new Date(entitlement.expiresAt).toLocaleDateString() : 'Never'}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <Badge variant={entitlement.isActive ? 'default' : 'secondary'}>
                              {entitlement.isActive ? 'Active' : 'Revoked'}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}