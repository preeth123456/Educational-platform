import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Filter, Edit, Power, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  code: string;
}

interface PricingPlan {
  id: number;
  name: string;
  product: Product;
  billing_cycle: string;
  price: number;
  currency: string;
  discount_percent: number;
  duration_days: number;
  limits_json: Record<string, any>;
  is_default: boolean;
  is_recommended: boolean;
  is_active: boolean;
  created_at: string;
}

const AdminPricingPlans = () => {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [filters, setFilters] = useState({
    product_id: 'all',
    billing_cycle: 'all',
    active_only: false
  });
  const [formData, setFormData] = useState({
    name: '',
    product_id: '',
    billing_cycle: '',
    price: 0,
    currency: 'INR',
    discount_percent: 0,
    duration_days: 30,
    limits_json: { max_ai_requests_per_day: 100, max_courses_access: 5, max_mock_tests: 10, downloadable_materials: true },
    is_default: false,
    is_recommended: false,
    is_active: true
  });
  const [limitsInput, setLimitsInput] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchPlans();
    fetchProducts();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/admin/pricing-plans/');
      const data = await response.json();
      if (data.success) {
        setPlans(data.data);
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch pricing plans", variant: "destructive" });
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products/');
      const data = await response.json();
      if (data.success) {
        setProducts(data.data.filter((p: any) => p.is_active));
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch products", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let limits = formData.limits_json;
      if (limitsInput) {
        try {
          limits = JSON.parse(limitsInput);
        } catch {
          toast({ title: "Error", description: "Invalid JSON in limits", variant: "destructive" });
          return;
        }
      }

      const url = editingPlan ? `/api/admin/pricing-plans/${editingPlan.id}/` : '/api/admin/pricing-plans/';
      const method = editingPlan ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          limits_json: limits
        })
      });
      
      const data = await response.json();
      if (data.success) {
        toast({ title: "Success", description: data.message });
        fetchPlans();
        setIsModalOpen(false);
        resetForm();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save pricing plan", variant: "destructive" });
    }
  };

  const togglePlanStatus = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/pricing-plans/${id}/status/`, {
        method: 'PATCH'
      });
      const data = await response.json();
      if (data.success) {
        fetchPlans();
        toast({ title: "Success", description: "Plan status updated" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const setAsDefault = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/pricing-plans/${id}/set-default/`, {
        method: 'PATCH'
      });
      const data = await response.json();
      if (data.success) {
        fetchPlans();
        toast({ title: "Success", description: "Default plan updated" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to set default", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      product_id: '',
      billing_cycle: '',
      price: 0,
      currency: 'INR',
      discount_percent: 0,
      duration_days: 30,
      limits_json: { max_ai_requests_per_day: 100, max_courses_access: 5, max_mock_tests: 10, downloadable_materials: true },
      is_default: false,
      is_recommended: false,
      is_active: true
    });
    setLimitsInput('');
    setEditingPlan(null);
  };

  const openEditModal = (plan: PricingPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      product_id: plan.product.id.toString(),
      billing_cycle: plan.billing_cycle,
      price: plan.price,
      currency: plan.currency,
      discount_percent: plan.discount_percent,
      duration_days: plan.duration_days,
      limits_json: plan.limits_json,
      is_default: plan.is_default,
      is_recommended: plan.is_recommended,
      is_active: plan.is_active
    });
    setLimitsInput(JSON.stringify(plan.limits_json, null, 2));
    setIsModalOpen(true);
  };

  const filteredPlans = plans.filter(plan => {
    if (filters.product_id && filters.product_id !== 'all' && plan.product.id.toString() !== filters.product_id) return false;
    if (filters.billing_cycle && filters.billing_cycle !== 'all' && plan.billing_cycle !== filters.billing_cycle) return false;
    if (filters.active_only && !plan.is_active) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pricing Plans</h1>
          <p className="text-gray-600">Create and manage pricing for products</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{editingPlan ? 'Edit Pricing Plan' : 'Add New Pricing Plan'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Plan Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="product_id">Product *</Label>
                  <Select value={formData.product_id} onValueChange={(value) => setFormData(prev => ({ ...prev, product_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(product => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="billing_cycle">Billing Cycle</Label>
                  <Select value={formData.billing_cycle} onValueChange={(value) => setFormData(prev => ({ ...prev, billing_cycle: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cycle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Quarterly">Quarterly</SelectItem>
                      <SelectItem value="Yearly">Yearly</SelectItem>
                      <SelectItem value="One-time">One-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discount_percent">Discount %</Label>
                  <Input
                    id="discount_percent"
                    type="number"
                    value={formData.discount_percent}
                    onChange={(e) => setFormData(prev => ({ ...prev, discount_percent: parseFloat(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="duration_days">Duration (Days)</Label>
                  <Input
                    id="duration_days"
                    type="number"
                    value={formData.duration_days}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration_days: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="limits">Limits (JSON)</Label>
                <textarea
                  id="limits"
                  className="w-full h-32 p-2 border rounded"
                  value={limitsInput || JSON.stringify(formData.limits_json, null, 2)}
                  onChange={(e) => setLimitsInput(e.target.value)}
                  placeholder='{"max_ai_requests_per_day": 100, "max_courses_access": 5}'
                />
              </div>

              <div className="flex space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_default"
                    checked={formData.is_default}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_default: checked }))}
                  />
                  <Label htmlFor="is_default">Default Plan</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_recommended"
                    checked={formData.is_recommended}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_recommended: checked }))}
                  />
                  <Label htmlFor="is_recommended">Recommended</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPlan ? 'Update' : 'Create'} Plan
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Filter className="w-4 h-4" />
            <Select value={filters.product_id} onValueChange={(value) => setFilters(prev => ({ ...prev, product_id: value }))}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                {products.map(product => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filters.billing_cycle} onValueChange={(value) => setFilters(prev => ({ ...prev, billing_cycle: value }))}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by cycle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cycles</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Quarterly">Quarterly</SelectItem>
                <SelectItem value="Yearly">Yearly</SelectItem>
                <SelectItem value="One-time">One-time</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Switch
                checked={filters.active_only}
                onCheckedChange={(checked) => setFilters(prev => ({ ...prev, active_only: checked }))}
              />
              <Label>Active only</Label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">ID</th>
                  <th className="text-left p-2">Plan Name</th>
                  <th className="text-left p-2">Product</th>
                  <th className="text-left p-2">Cycle</th>
                  <th className="text-left p-2">Price</th>
                  <th className="text-left p-2">Discount</th>
                  <th className="text-left p-2">Duration</th>
                  <th className="text-left p-2">Badges</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlans.map((plan) => (
                  <tr key={plan.id} className="border-b">
                    <td className="p-2">{plan.id}</td>
                    <td className="p-2 font-medium">{plan.name}</td>
                    <td className="p-2">{plan.product.name}</td>
                    <td className="p-2">{plan.billing_cycle}</td>
                    <td className="p-2">{plan.currency} {plan.price}</td>
                    <td className="p-2">{plan.discount_percent}%</td>
                    <td className="p-2">{plan.duration_days} days</td>
                    <td className="p-2">
                      <div className="flex space-x-1">
                        {plan.is_recommended && <Badge variant="default">Recommended</Badge>}
                        {plan.is_default && <Badge variant="secondary">Default</Badge>}
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge variant={plan.is_active ? "default" : "secondary"}>
                        {plan.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => openEditModal(plan)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => togglePlanStatus(plan.id)}
                        >
                          <Power className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setAsDefault(plan.id)}
                        >
                          <Star className="w-4 h-4" />
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
    </div>
  );
};

export default AdminPricingPlans;