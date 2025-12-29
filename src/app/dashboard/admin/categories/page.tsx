'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Title } from '@/components/ui/title'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Search, Edit, Trash2, Folder, Image as ImageIcon, X, Check } from 'lucide-react';

type Category = {
  id: string;
  name: string;
  description: string;
  slug: string;
  productCount: number;
  status: 'active' | 'archived';
  featured: boolean;
  imageUrl?: string;
};

const mockCategories: Category[] = [
  { 
    id: '1', 
    name: 'Sofas', 
    description: 'Comfortable seating for your living space', 
    slug: 'sofas',
    productCount: 24, 
    status: 'active',
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: '2', 
    name: 'Dining', 
    description: 'Elegant dining furniture for your home', 
    slug: 'dining',
    productCount: 18, 
    status: 'active',
    featured: true
  },
  { 
    id: '3', 
    name: 'Beds', 
    description: 'Comfortable beds for a good night\'s sleep', 
    slug: 'beds',
    productCount: 15, 
    status: 'active',
    featured: false
  },
  { 
    id: '4', 
    name: 'Chairs', 
    description: 'Stylish chairs for any room', 
    slug: 'chairs',
    productCount: 32, 
    status: 'active',
    featured: false
  },
  { 
    id: '5', 
    name: 'Vintage', 
    description: 'Classic vintage furniture', 
    slug: 'vintage',
    productCount: 5, 
    status: 'archived',
    featured: false
  },
];

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    status: true,
    featured: false,
  });

  useEffect(() => {
    if (isAddModalOpen) {
      if (selectedCategory) {
        setForm({
          name: selectedCategory.name,
          slug: selectedCategory.slug,
          description: selectedCategory.description,
          status: selectedCategory.status === 'active',
          featured: selectedCategory.featured,
        });
      } else {
        setForm({ name: '', slug: '', description: '', status: true, featured: false });
      }
    }
  }, [isAddModalOpen, selectedCategory]);

  // Filter categories
  const filteredCategories = useMemo(() => {
    return categories.filter(category => {
      const matchesSearch = 
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || category.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [categories, searchTerm, statusFilter]);

  // Toggle category status
  const toggleCategoryStatus = (id: string) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.id === id 
          ? { ...cat, status: cat.status === 'active' ? 'archived' : 'active' } 
          : cat
      )
    );
  };

  // Toggle featured status
  const toggleFeatured = (id: string) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.id === id 
          ? { ...cat, featured: !cat.featured } 
          : cat
      )
    );
  };

  // Handle edit category
  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsEditing(true);
    setIsAddModalOpen(true);
  };

  // Handle delete category
  const handleDeleteCategory = (id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
  };

  // Handle add new category
  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsEditing(false);
    setIsAddModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-gray-600">Manage your product categories</p>
        </div>
        <Button 
          icon={Plus} 
          className="mt-4 md:mt-0 w-full md:w-auto"
          onClick={handleAddCategory}
        >
          Add Category
        </Button>
      </div>

      <Card className="mb-6">
        <div className="space-y-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Text>Search</Text>
              <Input 
                icon={Search}
                placeholder="Search by name, slug, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Text>Status</Text>
              <Select 
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as 'all' | 'active' | 'archived')}
              >
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </Select>
            </div>
          </div>
          {(searchTerm || statusFilter !== 'all') && (
            <div className="flex items-center gap-2 text-sm">
              <Text className="text-gray-600">
                Showing {filteredCategories.length} of {categories.length} categories
              </Text>
              <Button
                variant="light"
                size="xs"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Category</TableHeader>
                <TableHeader>Description</TableHeader>
                <TableHeader className="text-right">Products</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Featured</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex items-center">
                      {category.imageUrl ? (
                        <img 
                          src={category.imageUrl} 
                          alt={category.name}
                          className="h-10 w-10 rounded-md object-cover mr-3"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center mr-3">
                          <Folder className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-xs text-gray-500">/{category.slug}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-600 line-clamp-2">
                      {category.description}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-medium">{category.productCount}</div>
                  </TableCell>
                  <TableCell>
                    <div 
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        category.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-gray-100 text-gray-800'
                      } cursor-pointer`}
                      onClick={() => toggleCategoryStatus(category.id)}
                    >
                      {category.status === 'active' ? 'Active' : 'Archived'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <button
                        onClick={() => toggleFeatured(category.id)}
                        className={`p-1 rounded-full ${category.featured ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}
                      >
                        {category.featured ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        icon={Edit} 
                        size="xs" 
                        variant="light"
                        onClick={() => handleEditCategory(category)}
                      />
                      <Button 
                        icon={Trash2} 
                        size="xs" 
                        variant="light" 
                        color="red"
                        onClick={() => handleDeleteCategory(category.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Add/Edit Category Modal */}
      <Dialog open={isAddModalOpen} onClose={setIsAddModalOpen}>
        <DialogContent>
          <h3 className="text-lg font-medium mb-2">
            {isEditing ? 'Edit Category' : 'Add New Category'}
          </h3>
          
          <form className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input 
                placeholder="e.g., Living Room Furniture"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <Input 
                placeholder="e.g., living-room"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Enter a description..."
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="status-toggle"
                    checked={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="featured-toggle"
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    checked={form.featured}
                    onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                  />
                  <span className="text-sm text-gray-600">Featured</span>
                </label>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="light" 
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (!form.name || !form.slug) return;
                    if (isEditing && selectedCategory) {
                      setCategories((prev) =>
                        prev.map((cat) =>
                          cat.id === selectedCategory.id
                            ? {
                                ...cat,
                                name: form.name,
                                slug: form.slug,
                                description: form.description,
                                status: form.status ? 'active' : 'archived',
                                featured: form.featured,
                              }
                            : cat,
                        ),
                      );
                    } else {
                      const newCategory: Category = {
                        id: crypto.randomUUID(),
                        name: form.name,
                        slug: form.slug,
                        description: form.description,
                        status: form.status ? 'active' : 'archived',
                        featured: form.featured,
                        productCount: 0,
                      };
                      setCategories((prev) => [newCategory, ...prev]);
                    }
                    setIsAddModalOpen(false);
                    setSelectedCategory(null);
                    setIsEditing(false);
                  }}
                >
                  {isEditing ? 'Update Category' : 'Add Category'}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
