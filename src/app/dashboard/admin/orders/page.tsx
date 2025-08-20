'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { 
  Card, Title, Text, Button, Table, TableHead, TableRow, 
  TableHeaderCell, TableBody, TableCell, TextInput, 
  Select, SelectItem
} from '@tremor/react';
import { Search, Eye, Truck, CheckCircle, XCircle, Clock, Package } from 'lucide-react';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
type Order = {
  id: string;
  customer: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: number;
};

const mockOrders: Order[] = [
  { id: 'ORD-1001', customer: 'John Doe', date: '2023-05-15', status: 'delivered', total: 1299.99, items: 3 },
  { id: 'ORD-1002', customer: 'Jane Smith', date: '2023-05-16', status: 'processing', total: 899.99, items: 1 },
  { id: 'ORD-1003', customer: 'Robert Johnson', date: '2023-05-17', status: 'shipped', total: 2349.97, items: 4 },
  { id: 'ORD-1004', customer: 'Emily Davis', date: '2023-05-18', status: 'pending', total: 349.99, items: 2 },
  { id: 'ORD-1005', customer: 'Michael Wilson', date: '2023-05-19', status: 'cancelled', total: 599.99, items: 2 }
];

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const filteredOrders = useMemo(() => {
    return mockOrders.filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusBadge = (status: OrderStatus) => {
    type StatusConfig = {
      color: string;
      icon: React.ComponentType<{ className?: string }>;
      label: string;
    };

    const statusMap: Record<OrderStatus, StatusConfig> = {
      pending: { 
        color: 'bg-yellow-100 text-yellow-800',
        icon: Clock,
        label: 'Pending'
      },
      processing: { 
        color: 'bg-blue-100 text-blue-800',
        icon: Package,
        label: 'Processing'
      },
      shipped: { 
        color: 'bg-indigo-100 text-indigo-800',
        icon: Truck,
        label: 'Shipped'
      },
      delivered: { 
        color: 'bg-emerald-100 text-emerald-800',
        icon: CheckCircle,
        label: 'Delivered'
      },
      cancelled: { 
        color: 'bg-red-100 text-red-800',
        icon: XCircle,
        label: 'Cancelled'
      }
    };
    
    const { color, icon: Icon, label } = statusMap[status] || { 
      color: 'bg-gray-100 text-gray-800',
      icon: Clock,
      label: status
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-gray-600">Manage customer orders</p>
        </div>
        <Button>Create Order</Button>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Text>Search</Text>
            <TextInput 
              icon={Search}
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64">
            <Text>Status</Text>
            <Select 
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Order ID</TableHeaderCell>
                <TableHeaderCell>Customer</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Items</TableHeaderCell>
                <TableHeaderCell className="text-right">Total</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.items} items</TableCell>
                  <TableCell className="text-right">{formatCurrency(order.total)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    <Button icon={Eye} size="xs" variant="light" />
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
