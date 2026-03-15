import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/components/AdminLayout';
import { Coupon, sampleCoupons } from '@/utils/promoMockData';
import { Plus, Edit, Trash2, Power, Search, Percent } from 'lucide-react';

export default function AdminCouponManagement() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 0,
    minOrderValue: 0,
    maxDiscount: 0,
    expiryDate: '',
    usageLimit: 100,
    description: '',
    isActive: true
  });

  useEffect(() => {
    const stored = localStorage.getItem('admin_coupons');
    setCoupons(stored ? JSON.parse(stored) : sampleCoupons);
  }, []);

  const saveCoupons = (updatedCoupons: Coupon[]) => {
    setCoupons(updatedCoupons);
    localStorage.setItem('admin_coupons', JSON.stringify(updatedCoupons));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCoupon) {
      const updated = coupons.map(c => 
        c.id === editingCoupon.id 
          ? { ...c, ...formData, updatedAt: new Date().toISOString() }
          : c
      );
      saveCoupons(updated);
      alert('Coupon updated successfully!');
    } else {
      const newCoupon: Coupon = {
        id: `CPN${Date.now()}`,
        ...formData,
        usedCount: 0,
        createdAt: new Date().toISOString()
      };
      saveCoupons([...coupons, newCoupon]);
      alert('Coupon created successfully!');
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      code: '',
      type: 'percentage',
      value: 0,
      minOrderValue: 0,
      maxDiscount: 0,
      expiryDate: '',
      usageLimit: 100,
      description: '',
      isActive: true
    });
    setEditingCoupon(null);
    setShowModal(false);
  };

  const editCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minOrderValue: coupon.minOrderValue,
      maxDiscount: coupon.maxDiscount || 0,
      expiryDate: coupon.expiryDate,
      usageLimit: coupon.usageLimit,
      description: coupon.description,
      isActive: coupon.isActive
    });
    setShowModal(true);
  };

  const toggleStatus = (id: string) => {
    const updated = coupons.map(c => 
      c.id === id ? { ...c, isActive: !c.isActive } : c
    );
    saveCoupons(updated);
    alert('Coupon status updated!');
  };

  const deleteCoupon = (id: string) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      const updated = coupons.filter(c => c.id !== id);
      saveCoupons(updated);
      alert('Coupon deleted successfully!');
    }
  };

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coupon.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && coupon.isActive) ||
                         (statusFilter === 'inactive' && !coupon.isActive);
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Coupon Management
            </h1>
            <p style={{ color: '#6b7280' }}>
              Create and manage discount coupons
            </p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} style={{ marginRight: '0.5rem' }} />
            Create Coupon
          </Button>
        </div>

        {/* Filters */}
        <Card style={{ marginBottom: '2rem' }}>
          <CardContent style={{ padding: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '1rem', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Search Coupons
                </label>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                  <Input
                    placeholder="Search by code or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ paddingLeft: '40px' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Status
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coupons Table */}
        <Card>
          <CardContent>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Code</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Type</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Value</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Usage</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Expiry</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCoupons.map((coupon) => (
                    <tr key={coupon.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '12px', fontWeight: '600', color: '#8b5cf6' }}>
                        {coupon.code}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Percent size={14} />
                          {coupon.type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                        </div>
                      </td>
                      <td style={{ padding: '12px', fontWeight: '600' }}>
                        {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                        {coupon.maxDiscount && coupon.type === 'percentage' && (
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            Max: ₹{coupon.maxDiscount}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontSize: '0.875rem' }}>
                          {coupon.usedCount} / {coupon.usageLimit}
                        </div>
                        <div style={{ 
                          width: '60px', 
                          height: '4px', 
                          backgroundColor: '#e5e7eb', 
                          borderRadius: '2px',
                          marginTop: '4px'
                        }}>
                          <div style={{
                            width: `${(coupon.usedCount / coupon.usageLimit) * 100}%`,
                            height: '100%',
                            backgroundColor: '#8b5cf6',
                            borderRadius: '2px'
                          }} />
                        </div>
                      </td>
                      <td style={{ padding: '12px', fontSize: '0.875rem' }}>
                        {new Date(coupon.expiryDate).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <Badge variant={coupon.isActive ? 'default' : 'secondary'}>
                          {coupon.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <Button size="sm" variant="outline" onClick={() => editCoupon(coupon)}>
                            <Edit size={14} />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => toggleStatus(coupon.id)}
                          >
                            <Power size={14} />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => deleteCoupon(coupon.id)}
                            style={{ color: '#ef4444', borderColor: '#ef4444' }}
                          >
                            <Trash2 size={14} />
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

        {/* Create/Edit Modal */}
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
                {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
              </h3>

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                      Coupon Code *
                    </label>
                    <Input
                      value={formData.code}
                      onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                      placeholder="WELCOME20"
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                      Discount Type *
                    </label>
                    <Select value={formData.type} onValueChange={(value: 'percentage' | 'fixed') => setFormData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                      {formData.type === 'percentage' ? 'Percentage (%)' : 'Amount (₹)'} *
                    </label>
                    <Input
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, value: Number(e.target.value) }))}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                      Min Order Value (₹)
                    </label>
                    <Input
                      type="number"
                      value={formData.minOrderValue}
                      onChange={(e) => setFormData(prev => ({ ...prev, minOrderValue: Number(e.target.value) }))}
                    />
                  </div>
                  {formData.type === 'percentage' && (
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                        Max Discount (₹)
                      </label>
                      <Input
                        type="number"
                        value={formData.maxDiscount}
                        onChange={(e) => setFormData(prev => ({ ...prev, maxDiscount: Number(e.target.value) }))}
                      />
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                      Expiry Date *
                    </label>
                    <Input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                      Usage Limit
                    </label>
                    <Input
                      type="number"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: Number(e.target.value) }))}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Description
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the coupon"
                    rows={3}
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
                    {editingCoupon ? 'Update' : 'Create'} Coupon
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