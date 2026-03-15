import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/components/AdminLayout';
import { entitlementService } from '@/utils/entitlementService';
import { Entitlement } from '@/utils/promoMockData';
import { Plus, Search, Crown, Wallet, GraduationCap, Gift, Users, Shield } from 'lucide-react';

export default function AdminEntitlementEngine() {
  const [entitlements, setEntitlements] = useState<Entitlement[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    type: 'PLAN_ACCESS' as Entitlement['type'],
    value: '',
    description: '',
    grantedBy: 'Admin',
    expiresAt: '',
    isActive: true
  });

  useEffect(() => {
    loadEntitlements();
  }, []);

  const loadEntitlements = () => {
    const allEntitlements = entitlementService.getAllEntitlements();
    setEntitlements(allEntitlements);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    entitlementService.grantEntitlement({
      studentId: formData.studentId,
      type: formData.type,
      value: formData.value,
      description: formData.description,
      grantedBy: formData.grantedBy,
      expiresAt: formData.expiresAt || undefined,
      isActive: formData.isActive
    });
    
    loadEntitlements();
    resetForm();
    alert('Entitlement granted successfully!');
  };

  const resetForm = () => {
    setFormData({
      studentId: '',
      type: 'PLAN_ACCESS',
      value: '',
      description: '',
      grantedBy: 'Admin',
      expiresAt: '',
      isActive: true
    });
    setShowModal(false);
  };

  const revokeEntitlement = (id: string) => {
    if (confirm('Are you sure you want to revoke this entitlement?')) {
      entitlementService.revokeEntitlement(id);
      loadEntitlements();
      alert('Entitlement revoked successfully!');
    }
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
    <AdminLayout>
      <div style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Entitlement Engine
            </h1>
            <p style={{ color: '#6b7280' }}>
              Manage student access rights and entitlements
            </p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} style={{ marginRight: '0.5rem' }} />
            Grant Entitlement
          </Button>
        </div>

        {/* Stats */}
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

        {/* Filters */}
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

        {/* Entitlements Table */}
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
                    <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntitlements.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                        <Shield size={32} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                        <p>No entitlements found</p>
                        <p style={{ fontSize: '0.875rem' }}>Grant entitlements to students to manage their access</p>
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
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          {entitlement.isActive && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => revokeEntitlement(entitlement.id)}
                              style={{ color: '#ef4444', borderColor: '#ef4444' }}
                            >
                              Revoke
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Grant Entitlement Modal */}
        {showModal && (
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
                Grant New Entitlement
              </h3>

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                      Student ID *
                    </label>
                    <Input
                      value={formData.studentId}
                      onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
                      placeholder="STU001"
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                      Entitlement Type *
                    </label>
                    <Select value={formData.type} onValueChange={(value: Entitlement['type']) => setFormData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PLAN_ACCESS">Plan Access</SelectItem>
                        <SelectItem value="WALLET_CREDITS">Wallet Credits</SelectItem>
                        <SelectItem value="COURSE_UNLOCK">Course Unlock</SelectItem>
                        <SelectItem value="PREMIUM_FEATURES">Premium Features</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                      Value *
                    </label>
                    <Input
                      value={formData.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                      placeholder={formData.type === 'WALLET_CREDITS' ? '1000' : 'Premium'}
                      required
                    />
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                      {formData.type === 'WALLET_CREDITS' ? 'Amount in rupees' : 'Plan name or feature identifier'}
                    </p>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                      Granted By
                    </label>
                    <Input
                      value={formData.grantedBy}
                      onChange={(e) => setFormData(prev => ({ ...prev, grantedBy: e.target.value }))}
                      placeholder="Admin"
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Description *
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the entitlement"
                    rows={3}
                    required
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Expires At (Optional)
                  </label>
                  <Input
                    type="datetime-local"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  />
                  <label htmlFor="isActive" style={{ fontWeight: '600' }}>
                    Active
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Grant Entitlement
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}