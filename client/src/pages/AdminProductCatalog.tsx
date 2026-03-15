import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Search, Edit, Eye, Power } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
}

const AdminProductCatalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    product_type: '',
    audience_role: '',
    description: '',
    features_json: [''],
    is_active: true
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products/');
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      } else {
        toast({ title: "Error", description: data.message || "Failed to fetch products", variant: "destructive" });
      }
    } catch (error) {
      console.error('Fetch products error:', error);
      toast({ title: "Error", description: "Failed to fetch products", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingProduct ? `/api/admin/products/${editingProduct.id}/` : '/api/admin/products/';
      const method = editingProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]')?.getAttribute('value') || ''
        },
        body: JSON.stringify({
          ...formData,
          features_json: formData.features_json.filter(f => f.trim())
        })
      });
      
      const data = await response.json();
      if (data.success) {
        toast({ title: "Success", description: data.message || "Product saved successfully" });
        fetchProducts();
        setIsModalOpen(false);
        resetForm();
      } else {
        toast({ title: "Error", description: data.message || "Failed to save product", variant: "destructive" });
      }
    } catch (error) {
      console.error('Product save error:', error);
      toast({ title: "Error", description: "Failed to save product", variant: "destructive" });
    }
  };

  const toggleProductStatus = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/products/${id}/status/`, {
        method: 'PATCH'
      });
      const data = await response.json();
      if (data.success) {
        fetchProducts();
        toast({ title: "Success", description: "Product status updated" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setFormData({
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

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      code: product.code,
      product_type: product.product_type,
      audience_role: product.audience_role,
      description: product.description,
      features_json: product.features_json.length ? product.features_json : [''],
      is_active: product.is_active
    });
    setIsModalOpen(true);
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features_json: [...prev.features_json, '']
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features_json: prev.features_json.map((f, i) => i === index ? value : f)
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features_json: prev.features_json.filter((_, i) => i !== index)
    }));
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Catalog</h1>
          <p className="text-gray-600">Manage products offered by Eduyata</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="code">Product Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="product_type">Product Type</Label>
                  <Select value={formData.product_type} onValueChange={(value) => setFormData(prev => ({ ...prev, product_type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Subscription">Subscription</SelectItem>
                      <SelectItem value="Add-on">Add-on</SelectItem>
                      <SelectItem value="One-time">One-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="audience_role">Audience</Label>
                  <Select value={formData.audience_role} onValueChange={(value) => setFormData(prev => ({ ...prev, audience_role: value }))}>
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
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div>
                <Label>Features</Label>
                {formData.features_json.map((feature, index) => (
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
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
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
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">ID</th>
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Code</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Audience</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Created</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="p-2">{product.id}</td>
                    <td className="p-2 font-medium">{product.name}</td>
                    <td className="p-2">{product.code}</td>
                    <td className="p-2">{product.product_type}</td>
                    <td className="p-2 capitalize">{product.audience_role}</td>
                    <td className="p-2">
                      <Badge variant={product.is_active ? "default" : "secondary"}>
                        {product.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="p-2">{new Date(product.created_at).toLocaleDateString()}</td>
                    <td className="p-2">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => openEditModal(product)}>
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
    </div>
  );
};

export default AdminProductCatalog;