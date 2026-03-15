import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLocation } from 'wouter';
import StudentLayout from '@/components/StudentLayout';
import { Search, ShoppingCart, BookOpen, Video, FileText, Users } from 'lucide-react';

interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  details: string;
}

const storeItems: StoreItem[] = [
  {
    id: 'course-1',
    name: 'Advanced Mathematics Course',
    description: 'Complete mathematics course with video lectures and practice tests.',
    price: 1999,
    category: 'Course',
    details: 'Comprehensive mathematics course covering algebra, calculus, and geometry with 50+ video lectures.'
  },
  {
    id: 'material-1',
    name: 'Physics Study Materials',
    description: 'Downloadable PDF materials for Class 12 Physics preparation.',
    price: 499,
    category: 'Material',
    details: 'High-quality study materials with solved examples, formulas, and practice questions.'
  },
  {
    id: 'test-1',
    name: 'JEE Mock Test Series',
    description: 'Complete mock test series for JEE Main and Advanced preparation.',
    price: 799,
    category: 'Test Series',
    details: '20 full-length mock tests with detailed solutions and performance analysis.'
  },
  {
    id: 'session-1',
    name: '1-on-1 Doubt Clearing Session',
    description: 'Personal mentoring session with expert teachers for doubt clearing.',
    price: 299,
    category: 'Session',
    details: '60-minute personalized session with subject expert for doubt clearing and guidance.'
  },
  {
    id: 'course-2',
    name: 'Chemistry Masterclass',
    description: 'Intensive chemistry course with practical demonstrations.',
    price: 1599,
    category: 'Course',
    details: 'Complete chemistry course with lab demonstrations and interactive quizzes.'
  },
  {
    id: 'material-2',
    name: 'English Literature Notes',
    description: 'Comprehensive notes for English literature with analysis.',
    price: 399,
    category: 'Material',
    details: 'Detailed analysis of poems, novels, and plays with critical appreciation.'
  }
];

export default function StudentStore() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [showModal, setShowModal] = useState(false);

  const categories = ['All', 'Course', 'Material', 'Test Series', 'Session'];

  const filteredItems = storeItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleViewDetails = (item: StoreItem) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleBuyNow = (itemId: string) => {
    navigate(`/student/order-checkout/${itemId}`);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Course': return <BookOpen className="w-4 h-4" />;
      case 'Material': return <FileText className="w-4 h-4" />;
      case 'Test Series': return <FileText className="w-4 h-4" />;
      case 'Session': return <Users className="w-4 h-4" />;
      default: return <ShoppingCart className="w-4 h-4" />;
    }
  };

  return (
    <StudentLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">One-Time Store</h1>
            <p className="text-lg text-gray-600">Buy courses, materials, test series, and sessions instantly.</p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow duration-300 border border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {getCategoryIcon(item.category)}
                      {item.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {item.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-purple-600">₹{item.price}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(item)}
                      className="flex-1"
                    >
                      View Details
                    </Button>
                    <Button
                      onClick={() => handleBuyNow(item.id)}
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      Buy Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        {/* Details Modal */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedItem?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                {selectedItem && getCategoryIcon(selectedItem.category)}
                {selectedItem?.category}
              </Badge>
              <p className="text-gray-700">{selectedItem?.details}</p>
              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-2xl font-bold text-purple-600">₹{selectedItem?.price}</span>
                <Button
                  onClick={() => {
                    if (selectedItem) {
                      handleBuyNow(selectedItem.id);
                      setShowModal(false);
                    }
                  }}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </StudentLayout>
  );
}