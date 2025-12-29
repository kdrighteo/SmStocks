'use client';

import { Card, Title, Text, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Badge } from '@/components/ui/tremor-replacements';
import { Button } from '@/components/ui/button';
import { Plus, Search, MoreHorizontal, Pencil, Trash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type Supplier = {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
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
    products: 28,
    status: 'active',
    lastOrder: '2023-06-10',
  },
  {
    id: 'SUP-003',
    name: 'Textile Solutions',
    contactPerson: 'Michael Chen',
    email: 'michael@textiles.com',
    phone: '(555) 456-7890',
    products: 15,
    status: 'inactive',
    lastOrder: '2023-05-28',
  },
  {
    id: 'SUP-004',
    name: 'Hardware Plus',
    contactPerson: 'Emily Davis',
    email: 'emily@hardwareplus.com',
    phone: '(555) 234-5678',
    products: 37,
    status: 'active',
    lastOrder: '2023-06-12',
  },
  {
    id: 'SUP-005',
    name: 'Upholstery World',
    contactPerson: 'Robert Wilson',
    email: 'robert@upholstery.com',
    phone: '(555) 876-5432',
    products: 21,
    status: 'inactive',
    lastOrder: '2023-05-15',
  },
];

export default function SuppliersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Title>Suppliers</Title>
          <Text className="mt-1">Manage your suppliers and their information</Text>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Supplier
        </Button>
      </div>

      <Card className="mt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search suppliers..."
                className="pl-8 w-full"
              />
            </div>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Supplier</TableHeaderCell>
                <TableHeaderCell>Contact</TableHeaderCell>
                <TableHeaderCell>Products</TableHeaderCell>
                <TableHeaderCell>Last Order</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell className="w-10"></TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>
                    <div className="font-medium">{supplier.name}</div>
                    <div className="text-sm text-muted-foreground">{supplier.id}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{supplier.contactPerson}</div>
                    <div className="text-sm text-muted-foreground">{supplier.email}</div>
                    <div className="text-sm text-muted-foreground">{supplier.phone}</div>
                  </TableCell>
                  <TableCell>{supplier.products} items</TableCell>
                  <TableCell>{supplier.lastOrder}</TableCell>
                  <TableCell>
                    <Badge color={supplier.status === 'active' ? 'emerald' : 'gray'}> 
                      {supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
          <div>Showing 1 to {mockSuppliers.length} of {mockSuppliers.length} entries</div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
