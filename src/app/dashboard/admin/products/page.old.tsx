'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, Text, Button, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Badge, TextInput } from '@/components/ui/tremor-replacements';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';

type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
};

const mockProducts: Product[] = [
  { id: '1', name: 'Modern Sofa', sku: 'FUR-SOF-001', category: 'Sofas', price: 1299.99, stock: 15, status: 'in_stock' },
  { id: '2', name: 'Dining Table', sku: 'FUR-TAB-001', category: 'Dining', price: 899.99, stock: 3, status: 'low_stock' },
  { id: '3', name: 'King Size Bed', sku: 'FUR-BED-001', category: 'Beds', price: 1599.99, stock: 0, status: 'out_of_stock' },
];

const statusColors = {
  in_stock: 'emerald',
  low_stock: 'yellow',
  out_of_stock: 'red'
};

export default function SimpleProductsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [products] = useState<Product[]>(mockProducts);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/auth/login');
    }
  }, [user, router]);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) return null;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <Text>Manage your product inventory</Text>
        </div>
        <Button icon={Plus}>Add Product</Button>
      </div>

      <Card>
        <div className="mb-4">
          <TextInput 
            icon={Search}
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{product.stock}</TableCell>
                  <TableCell>
                    <Badge color={statusColors[product.status]}>
                      {product.status.replace('_', ' ')}
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
