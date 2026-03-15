import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Settings, Package, CheckCircle, XCircle, Calendar } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

interface Product {
  product_id: string;
  name: string;
  description: string;
  board_type: string;
  is_active: boolean;
  created_at: string;
}

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [configuringProduct, setConfiguringProduct] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    name: '',
    description: '',
    board_type: '',
    is_active: true
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    product_id: '',
    name: '',
    description: '',
    board_type: ''
  });
  const [configData, setConfigData] = useState({
    curriculum_structure: '',
    assessment_pattern: '',
    grading_scale: 'percentage',
    subject_categories: '',
    exam_schedule: '',
    certification_type: 'board'
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('admin_token');
      console.log('Fetching products with token:', token ? 'Present' : 'Missing');
      
      const response = await fetch('http://localhost:8001/api/admin/config/products/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Products API response:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Products data:', data);
        setProducts(data.data || []);
      } else {
        console.error('Failed to fetch products:', response.status, await response.text());
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:8001/api/admin/config/products/create/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowForm(false);
        setFormData({ product_id: '', name: '', description: '', board_type: '' });
        fetchProducts();
      }
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const loadProductConfig = async (productId: string) => {
    try {
      // For now, just set default values since product config loading isn't implemented yet
      setConfigData({
        curriculum_structure: '',
        assessment_pattern: '',
        grading_scale: 'percentage',
        subject_categories: '',
        exam_schedule: '',
        certification_type: 'board'
      });
    } catch (error) {
      console.error('Error loading product config:', error);
    }
  };

  const saveProductConfiguration = async () => {
    try {
      const configs = [
        { key: 'curriculum_structure', value: configData.curriculum_structure },
        { key: 'assessment_pattern', value: configData.assessment_pattern },
        { key: 'grading_scale', value: configData.grading_scale },
        { key: 'subject_categories', value: configData.subject_categories },
        { key: 'exam_schedule', value: configData.exam_schedule },
        { key: 'certification_type', value: configData.certification_type }
      ].filter(config => config.value);
      
      const response = await fetch('http://localhost:8001/api/admin/config/products/save-configs/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: configuringProduct,
          configs: configs
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setConfiguringProduct(null);
        alert(`Product configuration saved successfully! ${result.message}`);
      } else {
        alert(`Error: ${result.message}`);
      }
      
    } catch (error) {
      console.error('Error saving product configuration:', error);
      alert('Error saving product configuration');
    }
  };

  const loadProductForEdit = async (productId: string) => {
    const product = products.find(p => p.product_id === productId);
    if (product) {
      setEditData({
        name: product.name,
        description: product.description,
        board_type: product.board_type,
        is_active: product.is_active
      });
    }
  };

  const updateProduct = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:8001/api/admin/config/products/${editingProduct}/update/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editData)
      });
      
      if (response.ok) {
        setEditingProduct(null);
        fetchProducts();
        alert('Product updated successfully!');
      } else {
        alert('Error updating product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product');
    }
  };

  if (loading) {
    return <div className="p-6">Loading products...</div>;
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
                <p className="text-gray-600">Manage educational products and curricula</p>
              </div>
            </div>
            <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {showForm && (
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Package className="w-5 h-5" />
                Create New Product
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Product ID</label>
                    <Input
                      value={formData.product_id}
                      onChange={(e) => setFormData({...formData, product_id: e.target.value})}
                      placeholder="e.g., cbse-standard"
                      className="border-gray-300 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Board Type</label>
                    <Input
                      value={formData.board_type}
                      onChange={(e) => setFormData({...formData, board_type: e.target.value})}
                      placeholder="e.g., CBSE"
                      className="border-gray-300 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Product Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., CBSE Standard Curriculum"
                    className="border-gray-300 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Description</label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Detailed product description"
                    className="border-gray-300 focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Create Product
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {configuringProduct && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Configure Product: {configuringProduct}</CardTitle>
                <Button size="sm" variant="outline" onClick={() => setConfiguringProduct(null)}>
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Curriculum Structure</label>
                  <Input 
                    placeholder="e.g., 10+2 System" 
                    value={configData.curriculum_structure}
                    onChange={(e) => setConfigData({...configData, curriculum_structure: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Assessment Pattern</label>
                    <Input 
                      placeholder="e.g., Continuous Assessment" 
                      value={configData.assessment_pattern}
                      onChange={(e) => setConfigData({...configData, assessment_pattern: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Grading Scale</label>
                    <select
                      value={configData.grading_scale}
                      onChange={(e) => setConfigData({...configData, grading_scale: e.target.value})}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="cgpa">CGPA</option>
                      <option value="letter">Letter Grade</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subject Categories</label>
                  <Input 
                    placeholder="e.g., Core, Elective, Vocational" 
                    value={configData.subject_categories}
                    onChange={(e) => setConfigData({...configData, subject_categories: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Exam Schedule</label>
                    <Input 
                      placeholder="e.g., March, October" 
                      value={configData.exam_schedule}
                      onChange={(e) => setConfigData({...configData, exam_schedule: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Certification Type</label>
                    <select
                      value={configData.certification_type}
                      onChange={(e) => setConfigData({...configData, certification_type: e.target.value})}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="board">Board Certificate</option>
                      <option value="diploma">Diploma</option>
                      <option value="degree">Degree</option>
                    </select>
                  </div>
                </div>
                <Button onClick={saveProductConfiguration}>Save Configuration</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {editingProduct && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Edit Product: {editingProduct}</CardTitle>
                <Button size="sm" variant="outline" onClick={() => setEditingProduct(null)}>
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Product Name</label>
                  <Input 
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    placeholder="Product Name" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Input 
                    value={editData.description}
                    onChange={(e) => setEditData({...editData, description: e.target.value})}
                    placeholder="Product Description" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Board Type</label>
                    <Input 
                      value={editData.board_type}
                      onChange={(e) => setEditData({...editData, board_type: e.target.value})}
                      placeholder="e.g., CBSE" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      value={editData.is_active ? 'active' : 'inactive'}
                      onChange={(e) => setEditData({...editData, is_active: e.target.value === 'active'})}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <Button onClick={updateProduct}>Update Product</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6">
          {products.map((product) => (
            <Card key={product.product_id} className="shadow-md hover:shadow-lg transition-shadow border-0">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                        <Badge 
                          variant={product.is_active ? "default" : "secondary"}
                          className={product.is_active ? "bg-green-100 text-green-800 border-green-200" : ""}
                        >
                          {product.is_active ? (
                            <><CheckCircle className="w-3 h-3 mr-1" /> Active</>
                          ) : (
                            <><XCircle className="w-3 h-3 mr-1" /> Inactive</>
                          )}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-gray-600 flex items-center gap-2">
                          <span className="font-medium">ID:</span> 
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs">{product.product_id}</code>
                        </div>
                        <div className="text-sm text-gray-600 flex items-center gap-2">
                          <span className="font-medium">Board:</span> 
                          <Badge variant="outline" className="text-xs">{product.board_type}</Badge>
                        </div>
                        <p className="text-sm text-gray-700 mt-2">{product.description}</p>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                          <Calendar className="w-3 h-3" />
                          Created {new Date(product.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50" onClick={() => {
                      setConfiguringProduct(product.product_id);
                      loadProductConfig(product.product_id);
                    }}>
                      <Settings className="w-4 h-4 mr-1" />
                      Config
                    </Button>
                    <Button size="sm" variant="outline" className="border-gray-200 hover:bg-gray-50" onClick={() => {
                      setEditingProduct(product.product_id);
                      loadProductForEdit(product.product_id);
                    }}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {products.length === 0 && (
          <Card className="shadow-lg border-0">
            <CardContent className="p-12 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-gray-100 rounded-full">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">No Products Found</h3>
                  <p className="text-gray-500 max-w-md">Get started by creating your first educational product. You can add CBSE, ICSE, or State Board curricula.</p>
                </div>
                <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Product
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;