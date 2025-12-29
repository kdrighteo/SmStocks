'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card, LineChart, Title, Text, Metric, ProgressBar, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@/components/ui/tremor-replacements';
import { ShoppingCart, Users, Package, DollarSign, Box, CreditCard, RefreshCw, Tag, BarChart, Settings, FileText, Truck, AlertCircle, UserCheck } from 'lucide-react';
import { DashboardCard } from '@/components/dashboard/DashboardCard';

// Dummy data for the dashboard
const salesData = [
  {
    date: 'Jan',
    'Total Sales': 2890,
    'POS': 2400,
    'Momo': 240,
    'Bank Transfer': 250,
  },
  {
    date: 'Feb',
    'Total Sales': 2756,
    'POS': 2300,
    'Momo': 256,
    'Bank Transfer': 200,
  },
  {
    date: 'Mar',
    'Total Sales': 3322,
    'POS': 2800,
    'Momo': 322,
    'Bank Transfer': 200,
  },
  {
    date: 'Apr',
    'Total Sales': 3470,
    'POS': 3000,
    'Momo': 270,
    'Bank Transfer': 200,
  },
  {
    date: 'May',
    'Total Sales': 3475,
    'POS': 3000,
    'Momo': 275,
    'Bank Transfer': 200,
  },
  {
    date: 'Jun',
    'Total Sales': 4129,
    'POS': 3500,
    'Momo': 429,
    'Bank Transfer': 200,
  },
];


// Dummy data for inventory status
const inventoryData = [
  { name: 'In Stock', value: 589, color: 'emerald' },
  { name: 'Low Stock', value: 45, color: 'yellow' },
  { name: 'Out of Stock', value: 12, color: 'red' },
];

// Dummy data for top selling products
const topProducts = [
  { name: 'Modern Sofa', sales: 124, revenue: 12400 },
  { name: 'Dining Table', sales: 98, revenue: 9800 },
  { name: 'Office Chair', sales: 87, revenue: 8700 },
  { name: 'Bookshelf', sales: 76, revenue: 7600 },
  { name: 'Coffee Table', sales: 65, revenue: 6500 },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedView, setSelectedView] = useState('1M');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/auth/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
        <div>
          <Title className="text-2xl font-bold">Dashboard Overview</Title>
          <Text className="text-gray-600">Welcome back, {user.name}! Here's what's happening with your store today.</Text>
        </div>
        <div className="flex space-x-2 bg-white p-1 rounded-lg shadow-sm">
          {['Today', 'Week', 'Month', 'Year'].map((period) => (
            <button
              key={period}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedView === period
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setSelectedView(period)}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <DashboardCard
          title="Total Revenue"
          value="$24,780"
          icon={<DollarSign className="h-6 w-6" />}
          href="/dashboard/admin/sales"
          trend={{ value: '12.5% from last month', isPositive: true }}
        />
        <DashboardCard
          title="Total Orders"
          value="1,248"
          icon={<ShoppingCart className="h-6 w-6" />}
          href="/dashboard/admin/orders"
          trend={{ value: '8.2% from last month', isPositive: true }}
        />
        <DashboardCard
          title="Active Customers"
          value="856"
          icon={<Users className="h-6 w-6" />}
          href="/dashboard/admin/customers"
          trend={{ value: '5.3% from last month', isPositive: true }}
        />
        <DashboardCard
          title="Low Stock Items"
          value="12"
          icon={<AlertCircle className="h-6 w-6" />}
          href="/dashboard/admin/inventory"
          trend={{ value: '2 items need attention', isPositive: false }}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sales Overview */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Title>Sales Overview</Title>
                <Text>Total sales by payment method</Text>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100">
                  Export
                </button>
              </div>
            </div>
            <LineChart
              className="mt-4 h-80"
              data={salesData}
              index="date"
              categories={['Total Sales', 'POS', 'Momo', 'Bank Transfer']}
              colors={['blue', 'green', 'yellow', 'red']}
              yAxisWidth={60}
              showLegend={true}
            />
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <Title>Quick Actions</Title>
            <div className="mt-4 space-y-3">
              <Link
                href="/dashboard/admin/orders"
                className="flex items-center p-3 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
              >
                <ShoppingCart className="h-5 w-5 mr-3" />
                <span>View Orders</span>
              </Link>
              <Link
                href="/dashboard/admin/products?action=add"
                className="flex items-center p-3 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
              >
                <Package className="h-5 w-5 mr-3" />
                <span>Manage Products</span>
              </Link>
              <Link
                href="/dashboard/admin/customers?action=add"
                className="flex items-center p-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
              >
                <UserCheck className="h-5 w-5 mr-3" />
                <span>Manage Customers</span>
              </Link>
              <Link
                href="/dashboard/admin/reports"
                className="flex items-center p-3 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
              >
                <BarChart className="h-5 w-5 mr-3" />
                <span>Generate Report</span>
              </Link>
            </div>
          </Card>

          <Card>
            <Title>Inventory Status</Title>
            <div className="mt-4 space-y-4">
              {inventoryData.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Text>{item.name}</Text>
                    <Text>{item.value} items</Text>
                  </div>
                  <ProgressBar 
                    value={item.value / 6.46} 
                    color={item.color as any} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <div className="lg:col-span-2">
          <Card>
            <Title>Top Selling Products</Title>
            <div className="mt-4 space-y-4">
              {topProducts.map((product, index) => (
                <Link 
                  key={product.name} 
                  href="/dashboard/admin/products"
                  className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex-shrink-0 h-10 w-10 rounded-md bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                    {index + 1}
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-gray-500">{product.sales} sales</span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-sm font-medium text-gray-900">${product.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Top Seller
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-4 text-right">
              <Link 
                href="/dashboard/admin/products" 
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                View all products →
              </Link>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <div className="flex items-center justify-between">
            <Title>Recent Activity</Title>
            <Link 
              href="/dashboard/admin/orders" 
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              View All
            </Link>
          </div>
          <div className="mt-4 space-y-4">
            {[
              { 
                id: 1, 
                user: 'John Doe', 
                action: 'added 5 new products', 
                time: '2 minutes ago',
                icon: <Package className="h-5 w-5 text-blue-500" />,
                color: 'blue'
              },
              { 
                id: 2, 
                user: 'Jane Smith', 
                action: 'processed 3 orders', 
                time: '10 minutes ago',
                icon: <ShoppingCart className="h-5 w-5 text-green-500" />,
                color: 'green'
              },
              { 
                id: 3, 
                user: 'Mike Johnson', 
                action: 'updated inventory levels', 
                time: '25 minutes ago',
                icon: <RefreshCw className="h-5 w-5 text-amber-500" />,
                color: 'amber'
              },
              { 
                id: 4, 
                user: 'Sarah Williams', 
                action: 'created a new sale', 
                time: '1 hour ago',
                icon: <Tag className="h-5 w-5 text-purple-500" />,
                color: 'purple'
              },
              { 
                id: 5, 
                user: 'David Brown', 
                action: 'added a new supplier', 
                time: '2 hours ago',
                icon: <Truck className="h-5 w-5 text-indigo-500" />,
                color: 'indigo'
              },
            ].map((activity) => (
              <Link 
                key={activity.id}
                href="/dashboard/admin/orders"
                className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className={`p-1.5 rounded-lg bg-${activity.color}-50 text-${activity.color}-500`}>
                  {activity.icon}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.user}{' '}
                    <span className="text-gray-500 font-normal">{activity.action}</span>
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
