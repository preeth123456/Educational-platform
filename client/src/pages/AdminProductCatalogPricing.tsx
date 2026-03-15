import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Edit, Power, Star, Package, DollarSign, TrendingUp } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

interface Product {
  id: number;
  name: string;
  code: string;
  product_type: string;
  audience_role: string;
  description: string;
  features_json: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface PricingPlan {
  id: number;
  name: string;
  product: {
    id: number;
    name: string;
  };
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

const AdminProductCatalogPricing = () => {
  // Dummy data for products
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Eduyata Student Basic',
      code: 'EDU_STU_BASIC',
      product_type: 'Subscription',
      audience_role: 'student',
      description: 'Basic plan for students with essential features',
      features_json: ['Access to basic courses', 'AI assistance', 'Progress tracking', 'Mobile app access'],
      is_active: true,
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      name: 'Eduyata Student Premium',
      code: 'EDU_STU_PREMIUM',
      product_type: 'Subscription',
      audience_role: 'student',
      description: 'Premium plan for students with advanced features',
      features_json: ['Access to all courses', 'Unlimited AI assistance', 'Advanced analytics', 'Priority support', 'Downloadable content'],
      is_active: true,
      created_at: '2024-01-15T10:35:00Z',
      updated_at: '2024-01-15T10:35:00Z'
    },
    {
      id: 3,
      name: 'Eduyata Teacher Pro',
      code: 'EDU_TCH_PRO',
      product_type: 'Subscription',
      audience_role: 'teacher',
      description: 'Professional plan for teachers',
      features_json: ['Course creation tools', 'Student management', 'Analytics dashboard', 'Assignment grading', 'Virtual classroom'],
      is_active: true,
      created_at: '2024-01-15T10:40:00Z',
      updated_at: '2024-01-15T10:40:00Z'
    },
    {
      id: 4,
      name: 'Institution License',
      code: 'EDU_INST_LIC',
      product_type: 'Add-on',
      audience_role: 'institution',
      description: 'Enterprise solution for educational institutions',
      features_json: ['Unlimited users', 'Custom branding', 'Advanced reporting', 'API access', 'Dedicated support'],
      is_active: false,
      created_at: '2024-01-15T10:45:00Z',
      updated_at: '2024-01-15T10:45:00Z'
    }
  ]);

  // Dummy data for pricing plans
  const [plans, setPlans] = useState<PricingPlan[]>([
    {
      id: 1,
      name: 'Basic Monthly',
      product: { id: 1, name: 'Eduyata Student Basic' },
      billing_cycle: 'Monthly',
      price: 299,
      currency: 'INR',
      discount_percent: 0,
      duration_days: 30,
      limits_json: { max_users: 1, max_courses_access: 3, max_mock_tests: 5, downloadable_materials: false },
      is_default: true,
      is_recommended: false,
      is_active: true,
      created_at: '2024-01-15T11:00:00Z'
    },
    {
      id: 2,
      name: 'Premium Monthly',
      product: { id: 2, name: 'Eduyata Student Premium' },
      billing_cycle: 'Monthly',
      price: 599,
      currency: 'INR',
      discount_percent: 0,
      duration_days: 30,
      limits_json: { max_users: 1, max_courses_access: 999, max_mock_tests: 999, downloadable_materials: true },
      is_default: false,
      is_recommended: true,
      is_active: true,
      created_at: '2024-01-15T11:05:00Z'
    },
    {
      id: 3,
      name: 'Premium Yearly',
      product: { id: 2, name: 'Eduyata Student Premium' },
      billing_cycle: 'Yearly',
      price: 5990,
      currency: 'INR',
      discount_percent: 17,
      duration_days: 365,
      limits_json: { max_users: 1, max_courses_access: 999, max_mock_tests: 999, downloadable_materials: true },
      is_default: false,
      is_recommended: false,
      is_active: true,
      created_at: '2024-01-15T11:10:00Z'
    },
    {
      id: 4,
      name: 'Teacher Pro Monthly',
      product: { id: 3, name: 'Eduyata Teacher Pro' },
      billing_cycle: 'Monthly',
      price: 999,
      currency: 'INR',
      discount_percent: 0,
      duration_days: 30,
      limits_json: { max_students: 100, max_courses_created: 10, analytics_retention_days: 90, api_calls_per_day: 1000 },
      is_default: true,
      is_recommended: true,
      is_active: true,
      created_at: '2024-01-15T11:15:00Z'
    }
  ]);

  const [nextProductId, setNextProductId] = useState(5);
  const [nextPlanId, setNextPlanId] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  
  const [productFormData, setProductFormData] = useState({
    name: '',
    code: '',
    product_type: '',
    audience_role: '',
    description: '',
    features_json: [''],
    is_active: true
  });

  const [planFormData, setPlanFormData] = useState({
    name: '',
    product_id: '',
    billing_cycle: '',
    price: 0,
    currency: 'INR',
    discount_percent: 0,
    duration_days: 30,
    limits_json: { max_users: 100, storage_gb: 10, api_calls_per_day: 1000 },
    is_default: false,
    is_recommended: false,
    is_active: true
  });

  const [limitsInput, setLimitsInput] = useState('');

  const showMessage = (title: string, description: string) => {
    console.log(`${title}: ${description}`);
    alert(`${title}: ${description}`);
  };

  useEffect(() => {
    // Data is already loaded as dummy data, no need to fetch
  }, []);



  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        // Update existing product
        const updatedProducts = products.map(p => 
          p.id === editingProduct.id 
            ? { 
                ...p, 
                ...productFormData, 
                features_json: productFormData.features_json.filter(f => f.trim()),
                updated_at: new Date().toISOString()
              }
            : p
        );
        setProducts(updatedProducts);
        showMessage('Success', 'Product updated successfully');
      } else {
        // Create new product
        const newProduct: Product = {
          id: nextProductId,
          ...productFormData,
          features_json: productFormData.features_json.filter(f => f.trim()),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setProducts([...products, newProduct]);
        setNextProductId(nextProductId + 1);
        showMessage('Success', 'Product created successfully');
      }
      setIsProductModalOpen(false);
      resetProductForm();
    } catch (error) {
      showMessage('Error', 'Failed to save product');
    }
  };

  const handlePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let limits = planFormData.limits_json;
      if (limitsInput) {
        try {
          limits = JSON.parse(limitsInput);
        } catch {
          showMessage('Error', 'Invalid JSON in limits');
          return;
        }
      }

      const selectedProduct = products.find(p => p.id.toString() === planFormData.product_id);
      if (!selectedProduct) {
        showMessage('Error', 'Please select a product');
        return;
      }

      if (editingPlan) {
        // Update existing plan
        const updatedPlans = plans.map(p => 
          p.id === editingPlan.id 
            ? { 
                ...p, 
                ...planFormData,
                product: { id: selectedProduct.id, name: selectedProduct.name },
                limits_json: limits
              }
            : p
        );
        setPlans(updatedPlans);
        showMessage('Success', 'Plan updated successfully');
      } else {
        // Create new plan
        const newPlan: PricingPlan = {
          id: nextPlanId,
          ...planFormData,
          product: { id: selectedProduct.id, name: selectedProduct.name },
          limits_json: limits,
          created_at: new Date().toISOString()
        };
        setPlans([...plans, newPlan]);
        setNextPlanId(nextPlanId + 1);
        showMessage('Success', 'Plan created successfully');
      }
      setIsPlanModalOpen(false);
      resetPlanForm();
    } catch (error) {
      showMessage('Error', 'Failed to save plan');
    }
  };

  const resetProductForm = () => {
    setProductFormData({
      name: '',
      code: '',
      product_type: '',
      audience_role: '',
      description: '',
      features_json: [''],
      is_active: true
    });
    setEditingProduct(null);
  };

  const resetPlanForm = () => {
    setPlanFormData({
      name: '',
      product_id: '',
      billing_cycle: '',
      price: 0,
      currency: 'INR',
      discount_percent: 0,
      duration_days: 30,
      limits_json: { max_users: 100, storage_gb: 10, api_calls_per_day: 1000 },
      is_default: false,
      is_recommended: false,
      is_active: true
    });
    setLimitsInput('');
    setEditingPlan(null);
  };

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductFormData({
      name: product.name,
      code: product.code,
      product_type: product.product_type,
      audience_role: product.audience_role,
      description: product.description,
      features_json: product.features_json.length ? product.features_json : [''],
      is_active: product.is_active
    });
    setIsProductModalOpen(true);
  };

  const openEditPlan = (plan: PricingPlan) => {
    setEditingPlan(plan);
    setPlanFormData({
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
    setIsPlanModalOpen(true);
  };

  const addFeature = () => {
    setProductFormData(prev => ({
      ...prev,
      features_json: [...prev.features_json, '']
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setProductFormData(prev => ({
      ...prev,
      features_json: prev.features_json.map((f, i) => i === index ? value : f)
    }));
  };

  const removeFeature = (index: number) => {
    setProductFormData(prev => ({
      ...prev,
      features_json: prev.features_json.filter((_, i) => i !== index)
    }));
  };

  const toggleProductStatus = async (id: number) => {
    const updatedProducts = products.map(p => 
      p.id === id ? { ...p, is_active: !p.is_active, updated_at: new Date().toISOString() } : p
    );
    setProducts(updatedProducts);
    showMessage('Success', 'Product status updated');
  };

  const togglePlanStatus = async (id: number) => {
    const updatedPlans = plans.map(p => 
      p.id === id ? { ...p, is_active: !p.is_active } : p
    );
    setPlans(updatedPlans);
    showMessage('Success', 'Plan status updated');
  };

  const setAsRecommended = async (id: number) => {
    const updatedPlans = plans.map(p => ({
      ...p,
      is_recommended: p.id === id ? !p.is_recommended : p.is_recommended
    }));
    setPlans(updatedPlans);
    showMessage('Success', 'Recommended plan updated');
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activePlans = plans.filter(p => p.is_active).length;
  const recommendedPlan = plans.find(p => p.is_recommended);

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Catalog & Pricing</h1>
          <p className="text-gray-600">Manage products and pricing plans for Eduyata platform</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Active Plans</p>
                <p className="text-2xl font-bold">{activePlans}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Recommended Plan</p>
                <p className="text-lg font-bold">{recommendedPlan?.name || 'None'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-lg font-bold text-gray-500">Coming Soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="catalog" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="catalog">Catalog</TabsTrigger>
          <TabsTrigger value="pricing">Pricing Plans</TabsTrigger>
        </TabsList>
        
        <TabsContent value="catalog" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetProductForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        value={productFormData.name}
                        onChange={(e) => setProductFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="code">Product Code *</Label>
                      <Input
                        id="code"
                        value={productFormData.code}
                        onChange={(e) => setProductFormData(prev => ({ ...prev, code: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="product_type">Category</Label>
                      <Select value={productFormData.product_type} onValueChange={(value) => setProductFormData(prev => ({ ...prev, product_type: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Subscription">Subscription</SelectItem>
                          <SelectItem value="Add-on">Add-on</SelectItem>
                          <SelectItem value="Feature Pack">Feature Pack</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="audience_role">Target Audience</Label>
                      <Select value={productFormData.audience_role} onValueChange={(value) => setProductFormData(prev => ({ ...prev, audience_role: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select audience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="teacher">Teacher</SelectItem>
                          <SelectItem value="institution">Institution</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={productFormData.description}
                      onChange={(e) => setProductFormData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label>Features</Label>
                    {productFormData.features_json.map((feature, index) => (
                      <div key={index} className="flex gap-2 mt-2">
                        <Input
                          value={feature}
                          onChange={(e) => updateFeature(index, e.target.value)}
                          placeholder="Enter feature"
                        />
                        <Button type="button" variant="outline" onClick={() => removeFeature(index)}>
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addFeature} className="mt-2">
                      Add Feature
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={productFormData.is_active}
                      onCheckedChange={(checked) => setProductFormData(prev => ({ ...prev, is_active: checked }))}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsProductModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingProduct ? 'Update' : 'Create'} Product
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Product Name</th>
                      <th className="text-left p-2">Category</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Created Date</th>
                      <th className="text-left p-2">Updated Date</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b">
                        <td className="p-2 font-medium">{product.name}</td>
                        <td className="p-2">{product.product_type}</td>
                        <td className="p-2">
                          <Badge variant={product.is_active ? "default" : "secondary"}>
                            {product.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="p-2">{new Date(product.created_at).toLocaleDateString()}</td>
                        <td className="p-2">{new Date(product.updated_at).toLocaleDateString()}</td>
                        <td className="p-2">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => openEditProduct(product)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleProductStatus(product.id)}
                            >
                              <Power className="w-4 h-4" />
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
        </TabsContent>
        
        <TabsContent value="pricing" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isPlanModalOpen} onOpenChange={setIsPlanModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetPlanForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>{editingPlan ? 'Edit Pricing Plan' : 'Create New Pricing Plan'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handlePlanSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="plan_name">Plan Name *</Label>
                      <Input
                        id="plan_name"
                        value={planFormData.name}
                        onChange={(e) => setPlanFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="product_id">Product *</Label>
                      <Select value={planFormData.product_id} onValueChange={(value) => setPlanFormData(prev => ({ ...prev, product_id: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.filter(p => p.is_active).map(product => (
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
                      <Label htmlFor="price">Price *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={planFormData.price}
                        onChange={(e) => setPlanFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="billing_cycle">Billing Cycle</Label>
                      <Select value={planFormData.billing_cycle} onValueChange={(value) => setPlanFormData(prev => ({ ...prev, billing_cycle: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select cycle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Monthly">Monthly</SelectItem>
                          <SelectItem value="Yearly">Yearly</SelectItem>
                          <SelectItem value="One-time">One-time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration (Days)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={planFormData.duration_days}
                        onChange={(e) => setPlanFormData(prev => ({ ...prev, duration_days: parseInt(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="limits">Limits (JSON)</Label>
                    <textarea
                      id="limits"
                      className="w-full h-32 p-2 border rounded"
                      value={limitsInput || JSON.stringify(planFormData.limits_json, null, 2)}
                      onChange={(e) => setLimitsInput(e.target.value)}
                      placeholder='{"max_users": 100, "storage_gb": 10}'
                    />
                  </div>

                  <div className="flex space-x-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_recommended"
                        checked={planFormData.is_recommended}
                        onCheckedChange={(checked) => setPlanFormData(prev => ({ ...prev, is_recommended: checked }))}
                      />
                      <Label htmlFor="is_recommended">Recommended</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_active"
                        checked={planFormData.is_active}
                        onCheckedChange={(checked) => setPlanFormData(prev => ({ ...prev, is_active: checked }))}
                      />
                      <Label htmlFor="is_active">Active</Label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsPlanModalOpen(false)}>
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
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Plan Name</th>
                      <th className="text-left p-2">Monthly Price</th>
                      <th className="text-left p-2">Yearly Price</th>
                      <th className="text-left p-2">Max Users</th>
                      <th className="text-left p-2">Features</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map((plan) => (
                      <tr key={plan.id} className="border-b">
                        <td className="p-2 font-medium">{plan.name}</td>
                        <td className="p-2">{plan.currency} {plan.billing_cycle === 'Monthly' ? plan.price : '—'}</td>
                        <td className="p-2">{plan.currency} {plan.billing_cycle === 'Yearly' ? plan.price : '—'}</td>
                        <td className="p-2">{plan.limits_json.max_users || '—'}</td>
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
                            <Button size="sm" variant="outline" onClick={() => openEditPlan(plan)}>
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
                              onClick={() => setAsRecommended(plan.id)}
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
        </TabsContent>
      </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminProductCatalogPricing;