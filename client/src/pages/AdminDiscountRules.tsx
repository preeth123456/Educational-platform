import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/components/AdminLayout';
import { DiscountRule, sampleDiscountRules } from '@/utils/promoMockData';
import { Plus, Edit, Trash2, Power, Settings, Zap } from 'lucide-react';

export default function AdminDiscountRules() {
  const [rules, setRules] = useState<DiscountRule[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState<DiscountRule | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    condition: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    priority: 1,
    isActive: true
  });

  useEffect(() => {
    const stored = localStorage.getItem('admin_discount_rules');
    setRules(stored ? JSON.parse(stored) : sampleDiscountRules);
  }, []);

  const saveRules = (updatedRules: DiscountRule[]) => {
    setRules(updatedRules);
    localStorage.setItem('admin_discount_rules', JSON.stringify(updatedRules));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingRule) {
      const updated = rules.map(r => 
        r.id === editingRule.id 
          ? { ...r, ...formData }
          : r
      );
      saveRules(updated);
      alert('Rule updated successfully!');
    } else {
      const newRule: DiscountRule = {
        id: `RULE${Date.now()}`,
        ...formData,
        createdAt: new Date().toISOString()
      };
      saveRules([...rules, newRule]);
      alert('Rule created successfully!');
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      condition: '',
      discountType: 'percentage',
      discountValue: 0,
      priority: 1,
      isActive: true
    });
    setEditingRule(null);
    setShowModal(false);
  };

  const editRule = (rule: DiscountRule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name,
      condition: rule.condition,
      discountType: rule.discountType,
      discountValue: rule.discountValue,
      priority: rule.priority,
      isActive: rule.isActive
    });
    setShowModal(true);
  };

  const toggleStatus = (id: string) => {
    const updated = rules.map(r => 
      r.id === id ? { ...r, isActive: !r.isActive } : r
    );
    saveRules(updated);
    alert('Rule status updated!');
  };

  const deleteRule = (id: string) => {
    if (confirm('Are you sure you want to delete this rule?')) {
      const updated = rules.filter(r => r.id !== id);
      saveRules(updated);
      alert('Rule deleted successfully!');
    }
  };

  const activeRules = rules.filter(r => r.isActive).length;

  return (
    <AdminLayout>
      <div style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Discount Rules
            </h1>
            <p style={{ color: '#6b7280' }}>
              Create and manage automated discount rules
            </p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} style={{ marginRight: '0.5rem' }} />
            Create Rule
          </Button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <Card>
            <CardContent style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ backgroundColor: '#8b5cf6', color: 'white', padding: '0.75rem', borderRadius: '50%' }}>
                  <Settings size={20} />
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Rules</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{rules.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ backgroundColor: '#10b981', color: 'white', padding: '0.75rem', borderRadius: '50%' }}>
                  <Zap size={20} />
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Active Rules</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{activeRules}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rules Table */}
        <Card>
          <CardHeader>
            <CardTitle>Discount Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Rule Name</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Condition</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Discount</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Priority</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rules.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                        <Settings size={32} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                        <p>No discount rules created yet</p>
                        <p style={{ fontSize: '0.875rem' }}>Create your first rule to get started</p>
                      </td>
                    </tr>
                  ) : (
                    rules.map((rule) => (
                      <tr key={rule.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '12px', fontWeight: '600' }}>
                          {rule.name}
                        </td>
                        <td style={{ padding: '12px', fontSize: '0.875rem', color: '#6b7280' }}>
                          {rule.condition}
                        </td>
                        <td style={{ padding: '12px', fontWeight: '600' }}>
                          {rule.discountType === 'percentage' ? `${rule.discountValue}%` : `₹${rule.discountValue}`}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <Badge variant="outline">{rule.priority}</Badge>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                            {rule.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                            <Button size="sm" variant="outline" onClick={() => editRule(rule)}>
                              <Edit size={14} />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => toggleStatus(rule.id)}
                            >
                              <Power size={14} />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => deleteRule(rule.id)}
                              style={{ color: '#ef4444', borderColor: '#ef4444' }}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
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
                {editingRule ? 'Edit Rule' : 'Create New Rule'}
              </h3>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Rule Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Premium Plan Discount"
                    required
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Condition *
                  </label>
                  <Textarea
                    value={formData.condition}
                    onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value }))}
                    placeholder="If plan = Premium then 15% off"
                    rows={3}
                    required
                  />
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                    Describe when this rule should apply
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                      Discount Type *
                    </label>
                    <Select value={formData.discountType} onValueChange={(value: 'percentage' | 'fixed') => setFormData(prev => ({ ...prev, discountType: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                      {formData.discountType === 'percentage' ? 'Percentage (%)' : 'Amount (₹)'} *
                    </label>
                    <Input
                      type="number"
                      value={formData.discountValue}
                      onChange={(e) => setFormData(prev => ({ ...prev, discountValue: Number(e.target.value) }))}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                      Priority
                    </label>
                    <Input
                      type="number"
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: Number(e.target.value) }))}
                      min="1"
                    />
                  </div>
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
                    {editingRule ? 'Update' : 'Create'} Rule
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