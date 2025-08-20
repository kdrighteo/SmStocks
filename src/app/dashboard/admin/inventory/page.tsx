'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  Card, Title, Text, Button, Table, TableHead, TableRow, 
  TableHeaderCell, TableBody, TableCell, Badge, TextInput, 
  Select, SelectItem, Toggle, ToggleItem, Dialog, DialogPanel
} from '@tremor/react';
import { Plus, Search, Edit, Trash2, Box, Package, PackagePlus } from 'lucide-react';

type InventoryItem = {
  id: number;
  name: string;
  category: string;
  sku: string;
  price: number;
  cost: number;
  quantity: number;
  lowStockThreshold: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
};

const mockInventory: InventoryItem[] = [
  { id: 1, name: 'Modern Sofa Set', category: 'Living Room', sku: 'SOFA-001', price: 1299.99, cost: 799.99, quantity: 15, lowStockThreshold: 5, status: 'in_stock' },
  { id: 2, name: 'Dining Table Set', category: 'Dining', sku: 'DINE-001', price: 899.99, cost: 499.99, quantity: 8, lowStockThreshold: 3, status: 'in_stock' },
  { id: 3, name: 'King Size Bed Frame', category: 'Bedroom', sku: 'BED-001', price: 699.99, cost: 399.99, quantity: 12, lowStockThreshold: 4, status: 'in_stock' },
  { id: 4, name: 'Office Desk', category: 'Office', sku: 'DESK-001', price: 349.99, cost: 199.99, quantity: 20, lowStockThreshold: 5, status: 'in_stock' },
  { id: 5, name: 'Coffee Table', category: 'Living Room', sku: 'TBL-001', price: 249.99, cost: 149.99, quantity: 2, lowStockThreshold: 3, status: 'low_stock' },
  { id: 6, name: 'Bookshelf', category: 'Living Room', sku: 'SHELF-001', price: 199.99, cost: 99.99, quantity: 0, lowStockThreshold: 2, status: 'out_of_stock' },
];

export default function InventoryPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Get unique categories for filter
  const categories = useMemo(() => {
    const cats = new Set(mockInventory.map(item => item.category));
    return ['All Categories', ...Array.from(cats)];
  }, []);

  // Filter inventory
  const filteredInventory = useMemo(() => {
    return mockInventory.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchTerm, categoryFilter, statusFilter]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Get status badge
  const getStatusBadge = (item: InventoryItem) => {
    const status = item.quantity === 0 
      ? 'out_of_stock' 
      : item.quantity <= item.lowStockThreshold 
        ? 'low_stock' 
        : 'in_stock';
    
    const statusMap = {
      in_stock: { color: 'emerald', label: 'In Stock' },
      low_stock: { color: 'amber', label: 'Low Stock' },
      out_of_stock: { color: 'red', label: 'Out of Stock' }
    };
    
    const { color, label } = statusMap[status];
    return <Badge color={color}>{label}</Badge>;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Inventory</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <Button icon={PackagePlus} onClick={() => setIsAddModalOpen(true)}>
          Add Item
        </Button>
      </div>

      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-1">
            <Text>Search</Text>
            <TextInput 
              icon={Search}
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Text>Category</Text>
            <Select 
              value={categoryFilter}
              onValueChange={setCategoryFilter}
            >
              {categories.map(category => (
                <SelectItem key={category} value={category === 'All Categories' ? 'all' : category}>
                  {category}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div>
            <Text>Status</Text>
            <Select 
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="in_stock">In Stock</SelectItem>
              <SelectItem value="low_stock">Low Stock</SelectItem>
              <SelectItem value="out_of_stock">Out of Stock</SelectItem>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Product</TableHeaderCell>
                <TableHeaderCell>SKU</TableHeaderCell>
                <TableHeaderCell>Category</TableHeaderCell>
                <TableHeaderCell className="text-right">Price</TableHeaderCell>
                <TableHeaderCell className="text-right">Cost</TableHeaderCell>
                <TableHeaderCell className="text-right">Quantity</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-gray-500">{item.sku}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                  <TableCell className="text-right text-gray-500">{formatCurrency(item.cost)}</TableCell>
                  <TableCell className="text-right">
                    <span className={item.quantity <= item.lowStockThreshold ? 'font-bold' : ''}>
                      {item.quantity}
                    </span>
                    {item.quantity <= item.lowStockThreshold && (
                      <span className="ml-1 text-xs text-amber-600">
                        (Threshold: {item.lowStockThreshold})
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(item)}</TableCell>
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

      {/* Add Item Modal */}
      <Dialog open={isAddModalOpen} onClose={setIsAddModalOpen}>
        <DialogPanel>
          <div className="mb-6">
            <Title>Add New Inventory Item</Title>
            <Text>Add a new product to your inventory</Text>
          </div>
          
          <div className="space-y-4">
            <div>
              <Text>Product Name</Text>
              <TextInput placeholder="Enter product name" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text>SKU</Text>
                <TextInput placeholder="Enter SKU" />
              </div>
              <div>
                <Text>Category</Text>
                <Select>
                  {categories.filter(cat => cat !== 'All Categories').map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Text>Price</Text>
                <TextInput placeholder="0.00" />
              </div>
              <div>
                <Text>Cost</Text>
                <TextInput placeholder="0.00" />
              </div>
              <div>
                <Text>Quantity</Text>
                <TextInput placeholder="0" />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <Button 
                variant="light" 
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button>
                Add Item
              </Button>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </div>
  );
}
