'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Title } from '@/components/ui/title'
import { Text } from '@/components/ui/text'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Search, User, Phone, Mail, ShoppingCart, ArrowLeft, X, Check, Edit } from 'lucide-react';

// Mock customer data
const mockCustomers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '(555) 123-4567',
    loyaltyPoints: 1250,
    totalSpent: 12500,
    lastPurchase: '2023-05-10',
    status: 'active'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '(555) 987-6543',
    loyaltyPoints: 500,
    totalSpent: 5000,
    lastPurchase: '2023-05-15',
    status: 'active'
  },
  {
    id: 3,
    name: 'Robert Johnson',
    email: 'robert@example.com',
    phone: '(555) 456-7890',
    loyaltyPoints: 2500,
    totalSpent: 25000,
    lastPurchase: '2023-04-28',
    status: 'vip'
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily@example.com',
    phone: '(555) 234-5678',
    loyaltyPoints: 750,
    totalSpent: 7500,
    lastPurchase: '2023-05-12',
    status: 'active'
  },
  {
    id: 5,
    name: 'Michael Wilson',
    email: 'michael@example.com',
    phone: '(555) 345-6789',
    loyaltyPoints: 100,
    totalSpent: 1000,
    lastPurchase: '2023-05-18',
    status: 'new'
  }
];

export default function CustomerLookupPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customers, setCustomers] = useState(mockCustomers);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState<any>(null);

  useEffect(() => {
    if (!user || user.role !== 'cashier') {
      router.push('/auth/login');
    }
  }, [user, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (!searchQuery.trim()) {
        setCustomers(mockCustomers);
      } else {
        const query = searchQuery.toLowerCase();
        const filtered = mockCustomers.filter(
          customer => 
            customer.name.toLowerCase().includes(query) ||
            customer.email.toLowerCase().includes(query) ||
            customer.phone.includes(query)
        );
        setCustomers(filtered);
      }
      setIsLoading(false);
    }, 500);
  };

  const handleCustomerSelect = (customer: any) => {
    setSelectedCustomer(customer);
    setEditedCustomer({ ...customer });
    setEditMode(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedCustomer({
      ...editedCustomer,
      [field]: value
    });
  };

  const handleSaveChanges = () => {
    // In a real app, you would make an API call to update the customer
    setSelectedCustomer(editedCustomer);
    setEditMode(false);
    
    // Update the customers list
    setCustomers(customers.map(c => 
      c.id === editedCustomer.id ? editedCustomer : c
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'vip':
        return <Badge color="amber" className="ml-2">VIP</Badge>;
      case 'new':
        return <Badge color="blue" className="ml-2">New</Badge>;
      default:
        return null;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => router.back()}
          className="mr-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Customer Lookup</h1>
          <p className="text-gray-600">Search and manage customer information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search and List */}
        <div className={`${selectedCustomer ? 'lg:col-span-1' : 'lg:col-span-3'}`}>
          <Card className="h-full">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search by name, email, or phone"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Searching..." : "Search"}
                </Button>
              </div>
            </form>

            <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Last Purchase</TableHead>
                    <TableHead>Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow 
                      key={customer.id}
                      className={`cursor-pointer hover:bg-gray-50 ${
                        selectedCustomer?.id === customer.id ? 'bg-indigo-50' : ''
                      }`}
                      onClick={() => handleCustomerSelect(customer)}
                    >
                      <TableCell>
                        <div className="flex items-center">
                          <span className="font-medium">{customer.name}</span>
                          {getStatusBadge(customer.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(customer.lastPurchase).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{customer.loyaltyPoints.toLocaleString()}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {customers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No customers found
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Customer Details */}
        {selectedCustomer && (
          <div className="lg:col-span-2">
            <Card>
              <div className="flex justify-between items-start mb-6">
                <div>
                  {editMode ? (
                    <div className="flex items-center">
                      <Input
                        value={editedCustomer.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="text-2xl font-bold w-full"
                      />
                    </div>
                  ) : (
                    <h2 className="text-2xl font-bold flex items-center">
                      {selectedCustomer.name}
                      {getStatusBadge(selectedCustomer.status)}
                    </h2>
                  )}
                  <p className="text-gray-500">
                    Customer ID: {selectedCustomer.id}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {editMode ? (
                    <>
                      <Button 
                        variant="light" 
                        icon={X} 
                        onClick={() => setEditMode(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        color="green" 
                        icon={Check}
                        onClick={handleSaveChanges}
                      >
                        Save
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="light" 
                      icon={Edit}
                      onClick={() => setEditMode(true)}
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-gray-500" />
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      {editMode ? (
                        <Input
                          value={editedCustomer.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="mt-1 w-full"
                        />
                      ) : (
                        <p className="font-medium">{selectedCustomer.email}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      {editMode ? (
                        <Input
                          value={editedCustomer.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="mt-1 w-full"
                        />
                      ) : (
                        <p className="font-medium">{selectedCustomer.phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4 flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2 text-gray-500" />
                    Purchase History
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Spent</span>
                      <span className="font-medium">
                        ${selectedCustomer.totalSpent.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Loyalty Points</span>
                      <span className="font-medium text-indigo-600">
                        {selectedCustomer.loyaltyPoints.toLocaleString()} pts
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Last Purchase</span>
                      <span className="font-medium">
                        {new Date(selectedCustomer.lastPurchase).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-medium mb-4">Recent Orders</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-500 text-sm">
                    Recent orders will be displayed here. This is a placeholder for order history.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-end space-x-3">
                  <Button variant="light" color="red">
                    Block Customer
                  </Button>
                  <Button>
                    New Order
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
