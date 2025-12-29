'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Title } from '@/components/ui/title'
import { Text } from '@/components/ui/text'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Search, Edit, Trash2, Phone, Mail, Building, MoreHorizontal } from 'lucide-react';

type Supplier = {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  products: number;
  status: 'active' | 'inactive';
  lastOrder: string;
};

const mockSuppliers: Supplier[] = [
  {
    id: 'SUP-001',
    name: 'WoodCraft Inc.',
    contactPerson: 'John Smith',
    email: 'john@woodcraft.com',
    phone: '(555) 123-4567',
    address: '123 Woodland Dr, Portland, OR 97205',
    products: 42,
    status: 'active',
    lastOrder: '2023-06-15',
  },
  {
    id: 'SUP-002',
    name: 'MetalWorks Ltd.',
    contactPerson: 'Sarah Johnson',
    email: 'sarah@metalworks.com',
    phone: '(555) 987-6543',
    address: '456 Steel St, Pittsburgh, PA 15222',
    products: 28,
    status: 'active',
    lastOrder: '2023-07-22',
  },
  {
    id: 'SUP-003',
    name: 'Textile Masters',
    contactPerson: 'Michael Chen',
    email: 'michael@textilemasters.com',
    phone: '(555) 456-7890',
    address: '789 Fabric Ave, New York, NY 10001',
    products: 35,
    status: 'inactive',
    lastOrder: '2023-05-10',
  },
  {
    id: 'SUP-004',
    name: 'GlassArt Studios',
    contactPerson: 'Emily Davis',
    email: 'emily@glassart.com',
    phone: '(555) 789-0123',
    address: '321 Crystal Ln, Seattle, WA 98101',
    products: 18,
    status: 'active',
    lastOrder: '2023-08-05',
  },
];

export default function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);

  // Filter suppliers
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(supplier => {
      const matchesSearch = 
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.phone.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || supplier.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, suppliers]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle delete supplier
  const handleDeleteSupplier = (id: string) => {
    setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
    setIsDeleteDialogOpen(false);
    setSelectedSupplier(null);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Suppliers</h1>
          <p className="text-gray-600">Manage your product suppliers</p>
        </div>
        <Button 
          icon={Plus} 
          className="mt-4 md:mt-0 w-full md:w-auto"
          onClick={() => setIsAddDialogOpen(true)}
        >
          Add Supplier
        </Button>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Text>Search</Text>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <Text>Status</Text>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as 'all' | 'active' | 'inactive')}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Supplier</TableHeader>
                <TableHeader>Contact</TableHeader>
                <TableHeader>Products</TableHeader>
                <TableHeader>Last Order</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>
                    <div className="font-medium">{supplier.name}</div>
                    <div className="text-sm text-gray-500">{supplier.address}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      {supplier.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="h-4 w-4 mr-2" />
                      {supplier.phone}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {supplier.contactPerson}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{supplier.products} products</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{formatDate(supplier.lastOrder)}</div>
                  </TableCell>
                  <TableCell>
                    <Badge color={supplier.status === 'active' ? 'emerald' : 'gray'}>
                      {supplier.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        icon={Edit} 
                        size="xs" 
                        variant="light"
                        onClick={() => {
                          setSelectedSupplier(supplier);
                          setIsAddDialogOpen(true);
                        }}
                      />
                      <Button 
                        icon={Trash2} 
                        size="xs" 
                        variant="light" 
                        color="red"
                        onClick={() => {
                          setSelectedSupplier(supplier);
                          setIsDeleteDialogOpen(true);
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Add/Edit Supplier Dialog */}
      <Dialog open={isAddDialogOpen} onClose={setIsAddDialogOpen}>
        <DialogContent>
          <div className="mb-6">
            <Title>{selectedSupplier ? 'Edit Supplier' : 'Add New Supplier'}</Title>
            <Text className="mt-1">
              {selectedSupplier 
                ? 'Update the supplier details below.' 
                : 'Fill in the details to add a new supplier.'}
            </Text>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Company Name</label>
              <Input 
                placeholder="WoodCraft Inc." 
                defaultValue={selectedSupplier?.name || ''}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Contact Person</label>
                <Input 
                  placeholder="John Smith" 
                  defaultValue={selectedSupplier?.contactPerson || ''}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input 
                  type="email" 
                  placeholder="contact@example.com" 
                  defaultValue={selectedSupplier?.email || ''}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <Input 
                  placeholder="(555) 123-4567" 
                  defaultValue={selectedSupplier?.phone || ''}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <Select value={selectedSupplier?.status || 'active'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <Input 
                placeholder="123 Business St, City, State ZIP" 
                defaultValue={selectedSupplier?.address || ''}
              />
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <Button 
                variant="light" 
                onClick={() => {
                  setIsAddDialogOpen(false);
                  setSelectedSupplier(null);
                }}
              >
                Cancel
              </Button>
              <Button>
                {selectedSupplier ? 'Update Supplier' : 'Add Supplier'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={setIsDeleteDialogOpen}>
        <DialogContent>
          <div className="mb-6">
            <Title>Delete Supplier</Title>
            <Text className="mt-1">
              Are you sure you want to delete {selectedSupplier?.name}? This action cannot be undone.
            </Text>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button 
              variant="light" 
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedSupplier(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              color="red"
              onClick={() => selectedSupplier && handleDeleteSupplier(selectedSupplier.id)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
