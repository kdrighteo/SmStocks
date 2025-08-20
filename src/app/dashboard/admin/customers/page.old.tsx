'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, Title, Text, Button, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Badge, TextInput, Avatar } from '@tremor/react';
import { Search, User, Mail, Phone, Plus, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

// Mock data
const mockCustomers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '(555) 123-4567',
    orders: 5,
    totalSpent: 4250.97,
    lastOrder: '2023-05-15',
    status: 'active',
    joinDate: '2022-01-15'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '(555) 987-6543',
    orders: 3,
    totalSpent: 1899.98,
    lastOrder: '2023-05-18',
    status: 'active',
    joinDate: '2022-03-22'
  },
  {
    id: '3',
    name: 'Robert Johnson',
    email: 'robert@example.com',
    phone: '(555) 456-7890',
    orders: 8,
    totalSpent: 7250.50,
    lastOrder: '2023-05-20',
    status: 'vip',
    joinDate: '2021-11-05'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    phone: '(555) 234-5678',
    orders: 2,
    totalSpent: 1249.98,
    lastOrder: '2023-05-10',
    status: 'active',
    joinDate: '2023-01-30'
  },
  {
    id: '5',
    name: 'Michael Wilson',
    email: 'michael@example.com',
    phone: '(555) 345-6789',
    orders: 1,
    totalSpent: 349.99,
    lastOrder: '2023-04-28',
    status: 'inactive',
    joinDate: '2023-03-15'
  }
];

const statuses = {
  active: { label: 'Active', color: 'emerald' },
  vip: { label: 'VIP', color: 'violet' },
  inactive: { label: 'Inactive', color: 'gray' },
  blocked: { label: 'Blocked', color: 'red' }
};

export default function CustomersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/auth/login');
    }
  }, [user, router]);

  const handleSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedCustomers = () => {
    const sortableCustomers = [...mockCustomers];
    if (sortConfig.key) {
      sortableCustomers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableCustomers;
  };

  const getFilteredCustomers = () => {
    return getSortedCustomers().filter(customer => {
      const matchesSearch = 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="h-4 w-4 ml-1 inline" /> : 
      <ChevronDown className="h-4 w-4 ml-1 inline" />;
  };

  const toggleSelectCustomer = (id: string) => {
    setSelectedCustomers(prev => 
      prev.includes(id) 
        ? prev.filter(customerId => customerId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredCustomers.map(customer => customer.id));
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/admin/customers/edit/${id}`);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (!user) return null;

  const filteredCustomers = getFilteredCustomers();
  const totalCustomers = mockCustomers.length;
  const activeCustomers = mockCustomers.filter(c => c.status === 'active' || c.status === 'vip').length;
  const averageOrderValue = mockCustomers.reduce((sum, customer) => 
    sum + (customer.orders > 0 ? customer.totalSpent / customer.orders : 0), 0) / mockCustomers.length;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-gray-600">Manage your customers and their data</p>
        </div>
        <Button 
          icon={Plus} 
          onClick={() => router.push('/dashboard/admin/customers/add')}
        >
          Add Customer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-50 text-indigo-600">
              <User className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Customers</p>
              <p className="text-2xl font-semibold">{totalCustomers}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-50 text-green-600">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Customers</p>
              <p className="text-2xl font-semibold">{activeCustomers}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-50 text-blue-600">
              <DollarSign className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg. Order Value</p>
              <p className="text-2xl font-semibold">${averageOrderValue.toFixed(2)}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <TextInput
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <div className="flex space-x-2">
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              {Object.entries(statuses).map(([value, { label }]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>
                  <input
                    type="checkbox"
                    checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </TableHeaderCell>
                <TableHeaderCell 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('name')}
                >
                  Customer {getSortIcon('name')}
                </TableHeaderCell>
                <TableHeaderCell>Contact</TableHeaderCell>
                <TableHeaderCell 
                  className="text-right cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('orders')}
                >
                  Orders {getSortIcon('orders')}
                </TableHeaderCell>
                <TableHeaderCell 
                  className="text-right cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('totalSpent')}
                >
                  Total Spent {getSortIcon('totalSpent')}
                </TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={() => toggleSelectCustomer(customer.id)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Avatar 
                          className="h-8 w-8 mr-3"
                          size="sm"
                        >
                          {getInitials(customer.name)}
                        </Avatar>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-xs text-gray-500">
                            Joined {new Date(customer.joinDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="h-4 w-4 mr-1.5" />
                          {customer.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="h-4 w-4 mr-1.5" />
                          {customer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-medium">{customer.orders}</span>
                      <p className="text-xs text-gray-500">
                        Last: {new Date(customer.lastOrder).toLocaleDateString()}
                      </p>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${customer.totalSpent.toFixed(2)}
                      <p className="text-xs text-gray-500">
                        ${(customer.orders > 0 ? customer.totalSpent / customer.orders : 0).toFixed(2)} avg. order
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        color={statuses[customer.status]?.color || 'gray'}
                        className="capitalize"
                      >
                        {statuses[customer.status]?.label || customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <button 
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => handleEdit(customer.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() => {}}
                        >
                          <Mail className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <User className="h-12 w-12 text-gray-300 mb-2" />
                      <p className="text-lg font-medium">No customers found</p>
                      <p className="text-sm mt-1">
                        {searchTerm ? 'Try adjusting your search' : 'No customers in your store yet'}
                      </p>
                      {!searchTerm && (
                        <Button 
                          className="mt-4" 
                          icon={Plus}
                          onClick={() => router.push('/dashboard/admin/customers/add')}
                        >
                          Add Customer
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {selectedCustomers.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-indigo-600 mr-2" />
              <span className="text-sm font-medium">
                {selectedCustomers.length} {selectedCustomers.length === 1 ? 'customer' : 'customers'} selected
              </span>
            </div>
            <div className="flex space-x-3">
              <Button variant="light" color="red">
                Delete
              </Button>
              <Button variant="light">
                Export
              </Button>
              <Button>
                Add to Group
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
