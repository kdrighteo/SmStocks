'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, Title, Text, Button, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Badge, TextInput, Select, SelectItem } from '@tremor/react';
import { Search, Filter, Sliders, ChevronDown, ChevronUp, Eye, Truck, CheckCircle, XCircle, Clock, Package } from 'lucide-react';

// Mock data
const mockOrders = [
  {
    id: 'ORD-1001',
    customer: 'John Doe',
    date: '2023-05-15',
    status: 'completed',
    payment: 'Paid',
    fulfillment: 'Fulfilled',
    total: 1299.99,
    items: [
      { name: 'Modern Sofa', quantity: 1, price: 999.99 },
      { name: 'Throw Pillow', quantity: 2, price: 150.00 }
    ]
  },
  {
    id: 'ORD-1002',
    customer: 'Jane Smith',
    date: '2023-05-16',
    status: 'processing',
    payment: 'Paid',
    fulfillment: 'Processing',
    total: 899.99,
    items: [
      { name: 'Dining Table', quantity: 1, price: 899.99 }
    ]
  },
  {
    id: 'ORD-1003',
    customer: 'Robert Johnson',
    date: '2023-05-17',
    status: 'shipped',
    payment: 'Paid',
    fulfillment: 'Shipped',
    total: 1899.98,
    items: [
      { name: 'King Size Bed', quantity: 1, price: 1599.99 },
      { name: 'Mattress', quantity: 1, price: 299.99 }
    ]
  },
  {
    id: 'ORD-1004',
    customer: 'Emily Davis',
    date: '2023-05-18',
    status: 'pending',
    payment: 'Pending',
    fulfillment: 'Unfulfilled',
    total: 1249.98,
    items: [
      { name: 'Office Chair', quantity: 5, price: 249.99 }
    ]
  },
  {
    id: 'ORD-1005',
    customer: 'Michael Wilson',
    date: '2023-05-19',
    status: 'cancelled',
    payment: 'Refunded',
    fulfillment: 'Cancelled',
    total: 349.99,
    items: [
      { name: 'Bookshelf', quantity: 1, price: 349.99 }
    ]
  }
];

const statuses = {
  completed: { label: 'Completed', color: 'emerald' },
  processing: { label: 'Processing', color: 'blue' },
  shipped: { label: 'Shipped', color: 'violet' },
  pending: { label: 'Pending', color: 'yellow' },
  cancelled: { label: 'Cancelled', color: 'red' }
};

const paymentStatuses = {
  paid: 'Paid',
  pending: 'Pending',
  refunded: 'Refunded',
  failed: 'Failed'
};

const fulfillmentStatuses = {
  fulfilled: 'Fulfilled',
  unfulfilled: 'Unfulfilled',
  processing: 'Processing',
  shipped: 'Shipped',
  cancelled: 'Cancelled'
};

export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [fulfillmentFilter, setFulfillmentFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [showFilters, setShowFilters] = useState(false);

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

  const getSortedOrders = () => {
    const sortableOrders = [...mockOrders];
    if (sortConfig.key) {
      sortableOrders.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableOrders;
  };

  const getFilteredOrders = () => {
    return getSortedOrders().filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesPayment = paymentFilter === 'all' || order.payment === paymentFilter;
      const matchesFulfillment = fulfillmentFilter === 'all' || order.fulfillment === fulfillmentFilter;
      
      return matchesSearch && matchesStatus && matchesPayment && matchesFulfillment;
    });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="h-4 w-4 ml-1 inline" /> : 
      <ChevronDown className="h-4 w-4 ml-1 inline" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 mr-1.5" />;
      case 'processing':
        return <Clock className="h-4 w-4 mr-1.5" />;
      case 'shipped':
        return <Truck className="h-4 w-4 mr-1.5" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 mr-1.5" />;
      default:
        return <Package className="h-4 w-4 mr-1.5" />;
    }
  };

  const handleViewOrder = (id: string) => {
    router.push(`/dashboard/admin/orders/${id}`);
  };

  if (!user) return null;

  const filteredOrders = getFilteredOrders();
  const totalSales = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  const orderCount = filteredOrders.length;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-gray-600">Manage customer orders</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-50 text-indigo-600">
              <Package className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-semibold">{orderCount}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-50 text-green-600">
              <DollarSign className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Sales</p>
              <p className="text-2xl font-semibold">${totalSales.toFixed(2)}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-50 text-blue-600">
              <Truck className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">To Ship</p>
              <p className="text-2xl font-semibold">
                {filteredOrders.filter(o => o.fulfillment === 'Processing').length}
              </p>
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
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <Button 
            variant="light" 
            icon={showFilters ? ChevronUp : Sliders}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Filters'}
          </Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
              <Select 
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.entries(statuses).map(([value, { label }]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
              <Select 
                value={paymentFilter}
                onValueChange={setPaymentFilter}
              >
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.entries(paymentStatuses).map(([value, label]) => (
                  <SelectItem key={value} value={label}>
                    {label}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fulfillment</label>
              <Select 
                value={fulfillmentFilter}
                onValueChange={setFulfillmentFilter}
              >
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.entries(fulfillmentStatuses).map(([value, label]) => (
                  <SelectItem key={value} value={label}>
                    {label}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div className="md:col-span-3 flex justify-end">
              <Button 
                variant="light" 
                onClick={() => {
                  setStatusFilter('all');
                  setPaymentFilter('all');
                  setFulfillmentFilter('all');
                  setSearchTerm('');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('id')}
                >
                  Order {getSortIcon('id')}
                </TableHeaderCell>
                <TableHeaderCell 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('customer')}
                >
                  Customer {getSortIcon('customer')}
                </TableHeaderCell>
                <TableHeaderCell 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('date')}
                >
                  Date {getSortIcon('date')}
                </TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Payment</TableHeaderCell>
                <TableHeaderCell 
                  className="text-right cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('total')}
                >
                  Total {getSortIcon('total')}
                </TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      <span className="text-indigo-600 hover:underline cursor-pointer"
                        onClick={() => handleViewOrder(order.id)}>
                        {order.id}
                      </span>
                    </TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getStatusIcon(order.status)}
                        <Badge 
                          color={statuses[order.status].color}
                          className="capitalize"
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        color={
                          order.payment === 'Paid' ? 'emerald' : 
                          order.payment === 'Pending' ? 'yellow' :
                          order.payment === 'Refunded' ? 'blue' : 'red'
                        }
                        className="capitalize"
                      >
                        {order.payment}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${order.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="light" 
                        icon={Eye}
                        size="xs"
                        onClick={() => handleViewOrder(order.id)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                    No orders found. Try adjusting your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <div className="flex justify-between items-center text-sm text-gray-500">
        <div>Showing {filteredOrders.length} of {mockOrders.length} orders</div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border rounded-md hover:bg-gray-50">
            Previous
          </button>
          <button className="px-3 py-1 border rounded-md bg-indigo-50 text-indigo-600">
            1
          </button>
          <button className="px-3 py-1 border rounded-md hover:bg-gray-50">
            2
          </button>
          <button className="px-3 py-1 border rounded-md hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
