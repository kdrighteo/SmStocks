'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  Card, Title, Text, Button, Table, TableHead, TableRow, 
  TableHeaderCell, TableBody, TableCell, TextInput, Badge,
  Select, SelectItem, Dialog, DialogPanel
} from '@tremor/react';
import { Plus, Search, Edit, Trash2, Folder, ChevronDown, ChevronUp, X } from 'lucide-react';

type Category = {
  id: string;
  name: string;
  description: string;
  productCount: number;
  status: 'active' | 'archived';
};

const mockCategories: Category[] = [
  { id: '1', name: 'Sofas', description: 'Comfortable seating', productCount: 24, status: 'active' },
  { id: '2', name: 'Dining', description: 'Elegant dining furniture', productCount: 18, status: 'active' },
  { id: '3', name: 'Beds', description: 'Comfortable beds', productCount: 15, status: 'active' },
  { id: '4', name: 'Chairs', description: 'Stylish chairs', productCount: 32, status: 'active' },
  { id: '5', name: 'Storage', description: 'Smart storage', productCount: 21, status: 'archived' }
];

export default function CategoriesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('all');
  const [categories] = useState<Category[]>(mockCategories);
  const [sortConfig, setSortConfig] = useState<{key: keyof Category, direction: 'asc' | 'desc'}>({ 
    key: 'name', 
    direction: 'asc' 
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/auth/login');
    }
  }, [user, router]);

  const handleSort = (key: keyof Category) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortedCategories = () => {
    return [...categories].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const getFilteredCategories = () => {
    return getSortedCategories().filter(category => {
      const matchesSearch = 
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || category.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-gray-600">Manage product categories</p>
        </div>
        <Button icon={Plus}>Add Category</Button>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Text>Search</Text>
            <TextInput 
              icon={Search}
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64">
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

        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell 
                  className="cursor-pointer" 
                  onClick={() => handleSort('name')}
                >
                  Name
                  {sortConfig.key === 'name' && (
                    sortConfig.direction === 'asc' ? 
                    <ChevronUp className="h-4 w-4 ml-1 inline" /> : 
                    <ChevronDown className="h-4 w-4 ml-1 inline" />
                  )}
                </TableHeaderCell>
                <TableHeaderCell>Description</TableHeaderCell>
                <TableHeaderCell 
                  className="text-right cursor-pointer"
                  onClick={() => handleSort('productCount')}
                >
                  Products
                  {sortConfig.key === 'productCount' && (
                    sortConfig.direction === 'asc' ? 
                    <ChevronUp className="h-4 w-4 ml-1 inline" /> : 
                    <ChevronDown className="h-4 w-4 ml-1 inline" />
                  )}
                </TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getFilteredCategories().map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Folder className="h-5 w-5 mr-2 text-gray-400" />
                      {category.name}
                    </div>
                  </TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell className="text-right">{category.productCount}</TableCell>
                  <TableCell>
                    <Badge color={category.status === 'active' ? 'emerald' : 'gray'}>
                      {category.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button icon={Edit} size="xs" variant="light" />
                      <Button icon={Trash2} size="xs" variant="light" color="red" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
