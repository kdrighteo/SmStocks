'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Title } from '@/components/ui/title'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Search, Eye, Truck, CheckCircle, XCircle, Clock, Package, Plus, X, Calendar, User, DollarSign } from 'lucide-react';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
};

type Order = {
  id: string;
  customer: string;
  customerEmail?: string;
  customerPhone?: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  shippingAddress?: string;
  notes?: string;
};

const mockOrders: Order[] = [
  { 
    id: 'ORD-1001', 
    customer: 'John Doe', 
    customerEmail: 'john@example.com',
    customerPhone: '+1234567890',
    date: '2023-05-15', 
    status: 'delivered', 
    total: 1299.99, 
    items: [
      { productId: 'PROD-001', productName: 'Modern Leather Sofa', quantity: 1, price: 1299.99, subtotal: 1299.99 }
    ]
  },
  { 
    id: 'ORD-1002', 
    customer: 'Jane Smith',
    customerEmail: 'jane@example.com',
    date: '2023-05-16', 
    status: 'processing', 
    total: 899.99, 
    items: [
      { productId: 'PROD-002', productName: 'Dining Table Set', quantity: 1, price: 899.99, subtotal: 899.99 }
    ]
  },
  { 
    id: 'ORD-1003', 
    customer: 'Robert Johnson',
    customerEmail: 'robert@example.com',
    date: '2023-05-17', 
    status: 'shipped', 
    total: 2349.97, 
    items: [
      { productId: 'PROD-001', productName: 'Modern Leather Sofa', quantity: 1, price: 1299.99, subtotal: 1299.99 },
      { productId: 'PROD-004', productName: 'Ergonomic Office Chair', quantity: 3, price: 349.99, subtotal: 1049.98 }
    ]
  },
  { 
    id: 'ORD-1004', 
    customer: 'Emily Davis',
    customerEmail: 'emily@example.com',
    date: '2023-05-18', 
    status: 'pending', 
    total: 349.99, 
    items: [
      { productId: 'PROD-004', productName: 'Ergonomic Office Chair', quantity: 1, price: 349.99, subtotal: 349.99 }
    ]
  },
  { 
    id: 'ORD-1005', 
    customer: 'Michael Wilson',
    customerEmail: 'michael@example.com',
    date: '2023-05-19', 
    status: 'cancelled', 
    total: 599.99, 
    items: [
      { productId: 'PROD-005', productName: 'Coffee Table', quantity: 2, price: 249.99, subtotal: 499.98 }
    ]
  }
];

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);
  
  const [newOrderForm, setNewOrderForm] = useState({
    customer: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    notes: '',
    items: [] as OrderItem[],
  });

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesDate = dateFilter === 'all' || order.date === dateFilter;
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, searchTerm, statusFilter, dateFilter]);

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

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setIsUpdatingStatus(orderId);
    await new Promise(resolve => setTimeout(resolve, 500));
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    setIsUpdatingStatus(null);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleCreateOrder = async () => {
    if (!newOrderForm.customer || newOrderForm.items.length === 0) {
      alert('Please fill in customer name and add at least one item');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const total = newOrderForm.items.reduce((sum, item) => sum + item.subtotal, 0);
    const newOrder: Order = {
      id: `ORD-${String(orders.length + 1001).padStart(4, '0')}`,
      customer: newOrderForm.customer,
      customerEmail: newOrderForm.customerEmail || undefined,
      customerPhone: newOrderForm.customerPhone || undefined,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      total,
      items: newOrderForm.items,
      shippingAddress: newOrderForm.shippingAddress || undefined,
      notes: newOrderForm.notes || undefined,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setIsLoading(false);
    setIsCreateModalOpen(false);
    setNewOrderForm({
      customer: '',
      customerEmail: '',
      customerPhone: '',
      shippingAddress: '',
      notes: '',
      items: [],
    });
  };

  const getUniqueDates = () => {
    const dates = new Set(orders.map(order => order.date));
    return Array.from(dates).sort().reverse();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-gray-600">Manage customer orders</p>
        </div>
        <Button 
          icon={Plus}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Order
        </Button>
      </div>

      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex-1">
            <Text>Search</Text>
            <Input 
              icon={Search}
              placeholder="Search by order ID, customer name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <Text>Status</Text>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-48">
            <Text>Date</Text>
            <Select
              value={dateFilter}
              onValueChange={setDateFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Dates" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                {getUniqueDates().map(date => (
                  <SelectItem key={date} value={date}>{date}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Order ID</TableHeader>
                <TableHeader>Customer</TableHeader>
                <TableHeader>Date</TableHeader>
                <TableHeader>Items</TableHeader>
                <TableHeader className="text-right">Total</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customer}</div>
                      {order.customerEmail && (
                        <div className="text-xs text-gray-500">{order.customerEmail}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.items.length} items</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(order.total)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    <Button 
                      icon={Eye} 
                      size="xs" 
                      variant="light"
                      onClick={() => handleViewOrder(order)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Dialog open={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <Title>Order Details</Title>
                <Text>Order ID: {selectedOrder.id}</Text>
              </div>
              <Button
                variant="light"
                icon={X}
                onClick={() => setIsDetailModalOpen(false)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <Title className="mb-4">Customer Information</Title>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    <Text className="font-medium">{selectedOrder.customer}</Text>
                  </div>
                  {selectedOrder.customerEmail && (
                    <div className="flex items-center">
                      <Text className="text-sm text-gray-600">{selectedOrder.customerEmail}</Text>
                    </div>
                  )}
                  {selectedOrder.customerPhone && (
                    <div className="flex items-center">
                      <Text className="text-sm text-gray-600">{selectedOrder.customerPhone}</Text>
                    </div>
                  )}
                  {selectedOrder.shippingAddress && (
                    <div className="mt-4">
                      <Text className="text-sm font-medium">Shipping Address:</Text>
                      <Text className="text-sm text-gray-600">{selectedOrder.shippingAddress}</Text>
                    </div>
                  )}
                </div>
              </Card>

              <Card>
                <Title className="mb-4">Order Information</Title>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Text>Date:</Text>
                    <Text className="font-medium">{selectedOrder.date}</Text>
                  </div>
                  <div className="flex items-center justify-between">
                    <Text>Status:</Text>
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <Text>Total Items:</Text>
                    <Text className="font-medium">{selectedOrder.items.length}</Text>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <Text className="font-bold">Total Amount:</Text>
                    <Text className="font-bold text-lg">{formatCurrency(selectedOrder.total)}</Text>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="mb-6">
              <Title className="mb-4">Order Items</Title>
              <div className="overflow-x-auto">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeader>Product</TableHeader>
                      <TableHeader className="text-right">Quantity</TableHeader>
                      <TableHeader className="text-right">Price</TableHeader>
                      <TableHeader className="text-right">Subtotal</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(item.subtotal)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>

            {selectedOrder.notes && (
              <Card className="mb-6">
                <Title className="mb-2">Notes</Title>
                <Text>{selectedOrder.notes}</Text>
              </Card>
            )}

            <div className="flex flex-wrap gap-2">
              <Text className="w-full mb-2 font-medium">Update Status:</Text>
              {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map((status) => (
                <Button
                  key={status}
                  variant={selectedOrder.status === status ? 'primary' : 'light'}
                  size="sm"
                  onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                  disabled={isUpdatingStatus === selectedOrder.id || selectedOrder.status === status}
                >
                  {isUpdatingStatus === selectedOrder.id && selectedOrder.status === status ? 'Updating...' : getStatusBadge(status).props.children[1]}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Order Modal */}
      <Dialog open={isCreateModalOpen} onClose={() => {
        if (!isLoading) setIsCreateModalOpen(false);
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <Title>Create New Order</Title>
            <Button
              variant="light"
              icon={X}
              onClick={() => setIsCreateModalOpen(false)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Text>Customer Name *</Text>
                <Input
                  placeholder="Enter customer name"
                  value={newOrderForm.customer}
                  onChange={(e) => setNewOrderForm((f) => ({ ...f, customer: e.target.value }))}
                />
              </div>
              <div>
                <Text>Email</Text>
                <Input
                  type="email"
                  placeholder="customer@example.com"
                  value={newOrderForm.customerEmail}
                  onChange={(e) => setNewOrderForm((f) => ({ ...f, customerEmail: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Text>Phone</Text>
                <Input
                  placeholder="+1234567890"
                  value={newOrderForm.customerPhone}
                  onChange={(e) => setNewOrderForm((f) => ({ ...f, customerPhone: e.target.value }))}
                />
              </div>
              <div>
                <Text>Shipping Address</Text>
                <Input
                  placeholder="123 Main St, City, State"
                  value={newOrderForm.shippingAddress}
                  onChange={(e) => setNewOrderForm((f) => ({ ...f, shippingAddress: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Text>Notes</Text>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={3}
                placeholder="Additional notes..."
                value={newOrderForm.notes}
                onChange={(e) => setNewOrderForm((f) => ({ ...f, notes: e.target.value }))}
              />
            </div>

            <Card>
              <Title className="mb-4">Order Items</Title>
              {newOrderForm.items.length === 0 ? (
                <Text className="text-gray-500">No items added yet. Add items manually or import from POS.</Text>
              ) : (
                <div className="space-y-2">
                  {newOrderForm.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <Text className="font-medium">{item.productName}</Text>
                        <Text className="text-sm text-gray-500">Qty: {item.quantity} × {formatCurrency(item.price)}</Text>
                      </div>
                      <div className="flex items-center gap-2">
                        <Text className="font-medium">{formatCurrency(item.subtotal)}</Text>
                        <Button
                          size="xs"
                          variant="light"
                          color="red"
                          icon={X}
                          onClick={() => {
                            setNewOrderForm((f) => ({
                              ...f,
                              items: f.items.filter((_, i) => i !== index),
                            }));
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 border-t">
                    <div className="flex justify-between">
                      <Text className="font-bold">Total:</Text>
                      <Text className="font-bold text-lg">
                        {formatCurrency(newOrderForm.items.reduce((sum, item) => sum + item.subtotal, 0))}
                      </Text>
                    </div>
                  </div>
                </div>
              )}
              <Button
                variant="light"
                className="mt-4"
                onClick={() => {
                  const productName = prompt('Enter product name:');
                  const quantity = parseInt(prompt('Enter quantity:') || '1', 10);
                  const price = parseFloat(prompt('Enter price:') || '0');
                  if (productName && quantity > 0 && price > 0) {
                    setNewOrderForm((f) => ({
                      ...f,
                      items: [
                        ...f.items,
                        {
                          productId: `PROD-${Date.now()}`,
                          productName,
                          quantity,
                          price,
                          subtotal: quantity * price,
                        },
                      ],
                    }));
                  }
                }}
              >
                Add Item
              </Button>
            </Card>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="light"
                onClick={() => setIsCreateModalOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateOrder}
                disabled={isLoading || !newOrderForm.customer || newOrderForm.items.length === 0}
              >
                {isLoading ? 'Creating...' : 'Create Order'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
