'use client';

import { useState, useMemo } from 'react';
import { 
  Card, Title, Text, Button, Table, TableHead, TableRow, 
  TableHeaderCell, TableBody, TableCell, TextInput, Badge,
  Select, SelectItem, Dialog, DialogPanel
} from '@tremor/react';
import { Plus, Search, Edit, Trash2, Package, DollarSign, Tag, Check, X } from 'lucide-react';

type ProductStatus = 'in_stock' | 'low_stock' | 'out_of_stock';
type ProductCategory = 'sofas' | 'dining' | 'beds' | 'chairs' | 'tables' | 'storage';

interface Product {
  id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  price: number;
  stock: number;
  status: ProductStatus;
  imageUrl?: string;
}

const mockProducts: Product[] = [
  {
    id: 'PROD-001',
    name: 'Modern Leather Sofa',
    sku: 'FUR-SOF-001',
    category: 'sofas',
    price: 1299.99,
    stock: 15,
    status: 'in_stock',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'PROD-002',
    name: 'Dining Table Set',
    sku: 'FUR-DIN-001',
    category: 'dining',
    price: 899.99,
    stock: 3,
    status: 'low_stock',
  },
  {
    id: 'PROD-003',
    name: 'King Size Bed Frame',
    sku: 'FUR-BED-001',
    category: 'beds',
    price: 1599.99,
    stock: 0,
    status: 'out_of_stock',
  },
  {
    id: 'PROD-004',
    name: 'Ergonomic Office Chair',
    sku: 'FUR-CHA-001',
    category: 'chairs',
    price: 349.99,
    stock: 8,
    status: 'in_stock',
  },
  {
    id: 'PROD-005',
    name: 'Coffee Table',
    sku: 'FUR-TAB-002',
    category: 'tables',
    price: 249.99,
    stock: 5,
    status: 'low_stock',
  },
];

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [products] = useState<Product[]>(mockProducts);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, categoryFilter, statusFilter]);

  // Get status badge
  const getStatusBadge = (status: ProductStatus) => {
    switch (status) {
      case 'in_stock':
        return <Badge color="emerald" icon={Check}>In Stock</Badge>;
      case 'low_stock':
        return <Badge color="yellow">Low Stock</Badge>;
      case 'out_of_stock':
        return <Badge color="red" icon={X}>Out of Stock</Badge>;
      default:
        return <Badge color="gray">{status}</Badge>;
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <Button 
          icon={Plus} 
          className="mt-4 md:mt-0 w-full md:w-auto"
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Product
        </Button>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Text>Search</Text>
            <TextInput 
              icon={Search}
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <Text>Category</Text>
            <Select 
              value={categoryFilter}
              onValueChange={setCategoryFilter}
            >
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="sofas">Sofas</SelectItem>
              <SelectItem value="dining">Dining</SelectItem>
              <SelectItem value="beds">Beds</SelectItem>
              <SelectItem value="chairs">Chairs</SelectItem>
              <SelectItem value="tables">Tables</SelectItem>
              <SelectItem value="storage">Storage</SelectItem>
            </Select>
          </div>
          <div className="w-full md:w-48">
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
                <TableHeaderCell className="text-right">Stock</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center">
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="h-10 w-10 rounded-md object-cover mr-3"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center mr-3">
                          <Package className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                      <div className="font-medium">{product.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm bg-gray-50 px-2 py-1 rounded">{product.sku}</code>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize">{product.category}</span>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(product.price)}
                  </TableCell>
                  <TableCell className="text-right">
                    {product.stock}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(product.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        icon={Edit} 
                        size="xs" 
                        variant="light"
                        onClick={() => {}}
                      />
                      <Button 
                        icon={Trash2} 
                        size="xs" 
                        variant="light" 
                        color="red"
                        onClick={() => {}}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Add/Edit Product Modal */}
      <Dialog open={isAddModalOpen} onClose={setIsAddModalOpen}>
        <DialogPanel>
          <h3 className="text-lg font-medium mb-2">
            Add New Product
          </h3>
          
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product Name</label>
              <TextInput placeholder="e.g., Modern Leather Sofa" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">SKU</label>
                <TextInput placeholder="e.g., FUR-SOF-001" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <Select>
                  <SelectItem value="sofas">Sofas</SelectItem>
                  <SelectItem value="dining">Dining</SelectItem>
                  <SelectItem value="beds">Beds</SelectItem>
                  <SelectItem value="chairs">Chairs</SelectItem>
                  <SelectItem value="tables">Tables</SelectItem>
                  <SelectItem value="storage">Storage</SelectItem>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <TextInput className="pl-10" placeholder="0.00" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Stock</label>
                <TextInput type="number" placeholder="0" />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="light" 
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button>
                Add Product
              </Button>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </div>
  );
}
