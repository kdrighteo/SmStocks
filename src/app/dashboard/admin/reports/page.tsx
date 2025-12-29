'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Title } from '@/components/ui/title'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Metric } from '@/components/ui/metric'
import { LineChart } from '@/components/ui/line-chart'
import { BarChart } from '@/components/ui/bar-chart'
import { AreaChart } from '@/components/ui/area-chart'
import { DonutChart } from '@/components/ui/donut-chart'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download, BarChart2, LineChart as LineChartIcon, PieChart, Filter } from 'lucide-react';

// Mock data
const salesData = [
  { month: 'Jan', sales: 4000, orders: 124, customers: 89 },
  { month: 'Feb', sales: 3000, orders: 98, customers: 76 },
  { month: 'Mar', sales: 5000, orders: 145, customers: 102 },
  { month: 'Apr', sales: 4800, orders: 132, customers: 94 },
  { month: 'May', sales: 6900, orders: 187, customers: 128 },
  { month: 'Jun', sales: 7500, orders: 203, customers: 145 },
  { month: 'Jul', sales: 8200, orders: 221, customers: 158 },
  { month: 'Aug', sales: 7800, orders: 198, customers: 142 },
];

const categoryData = [
  { category: 'Living Room', sales: 21500, items: 1240 },
  { category: 'Bedroom', sales: 18700, items: 980 },
  { category: 'Dining', sales: 12500, items: 760 },
  { category: 'Office', sales: 9800, items: 540 },
  { category: 'Outdoor', sales: 6200, items: 320 },
];

const topProducts = [
  { name: 'Modern Sofa', category: 'Living Room', sales: 125, revenue: 124875 },
  { name: 'King Size Bed', category: 'Bedroom', sales: 98, revenue: 97902 },
  { name: 'Dining Table Set', category: 'Dining', sales: 87, revenue: 78299 },
  { name: 'Office Chair', category: 'Office', sales: 76, revenue: 15199 },
  { name: 'Coffee Table', category: 'Living Room', sales: 65, revenue: 16249 },
];

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState('last_30_days');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-gray-600">Analyze your business performance</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0 w-full md:w-auto">
          <Select 
            value={timeRange} 
            onValueChange={setTimeRange}
            className="w-full md:w-48"
          >
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="last_7_days">Last 7 days</SelectItem>
            <SelectItem value="last_30_days">Last 30 days</SelectItem>
            <SelectItem value="this_month">This Month</SelectItem>
            <SelectItem value="last_month">Last Month</SelectItem>
            <SelectItem value="this_year">This Year</SelectItem>
          </Select>
          <Button 
            variant="light" 
            className="w-full md:w-auto"
            onClick={async () => {
              setIsExporting(true);
              await new Promise(resolve => setTimeout(resolve, 1000));
              alert('Report exported successfully!');
              setIsExporting(false);
            }}
            disabled={isExporting}
          >
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[
          { title: 'Total Sales', value: formatCurrency(45231.89), change: '+20.1%', changeType: 'positive', icon: BarChart2 },
          { title: 'Total Orders', value: '1,234', change: '+12.3%', changeType: 'positive', icon: LineChartIcon },
          { title: 'Average Order Value', value: formatCurrency(367.19), change: '+5.4%', changeType: 'positive', icon: PieChart },
          { title: 'New Customers', value: '268', change: '-2.3%', changeType: 'negative', icon: Filter },
        ].map((metric, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text>{metric.title}</Text>
                <Metric className="mt-2">{metric.value}</Metric>
              </div>
              <div className={`p-3 rounded-lg ${
                metric.changeType === 'positive' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
              }`}>
                <metric.icon className="h-6 w-6" />
              </div>
            </div>
            <div className={`mt-4 text-sm ${
              metric.changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {metric.change} from last period
            </div>
          </Card>
        ))}
      </div>

      <Tabs className="mb-6">
        <TabsList className="mb-6">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>
        <TabsContent value="sales">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <Title>Sales Overview</Title>
                  <Text>Monthly sales performance</Text>
                  <LineChart
                    className="mt-6 h-80"
                    data={salesData}
                    index="month"
                    categories={['sales']}
                    colors={['blue']}
                    valueFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Button 
                    variant="light" 
                    size="xs" 
                    icon={Download}
                    className="ml-2"
                    onClick={async () => {
                      setIsExporting(true);
                      await new Promise(resolve => setTimeout(resolve, 1000));
                      alert('Sales report exported successfully!');
                      setIsExporting(false);
                    }}
                    disabled={isExporting}
                  >
                    {isExporting ? 'Exporting...' : 'Export'}
                  </Button>
                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    Top Seller
                  </span>
                </Card>
              </div>
              <div>
                <Card>
                  <Title>Sales by Category</Title>
                  <DonutChart
                    className="mt-6 h-64"
                    data={categoryData}
                    category="sales"
                    index="category"
                    valueFormatter={formatCurrency}
                    colors={['blue', 'cyan', 'indigo', 'violet', 'fuchsia']}
                  />
                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Trending
                  </span>
                </Card>
              </div>
            </div>
        </TabsContent>
        <TabsContent value="sales">
            <Card>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <Title>Top Selling Products</Title>
                  <Text>Best performing products by revenue</Text>
                </div>
                <Select 
                  value={categoryFilter} 
                  onValueChange={setCategoryFilter}
                  className="w-48"
                >
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="living_room">Living Room</SelectItem>
                  <SelectItem value="bedroom">Bedroom</SelectItem>
                  <SelectItem value="dining">Dining</SelectItem>
                  <SelectItem value="office">Office</SelectItem>
                </Select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4">Product</th>
                      <th className="py-3 px-4 text-right">Sales</th>
                      <th className="py-3 px-4 text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((product, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.category}</div>
                        </td>
                        <td className="py-3 px-4 text-right">{product.sales}</td>
                        <td className="py-3 px-4 text-right font-medium">{formatCurrency(product.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
        </TabsContent>
        <TabsContent value="sales">
            <Card>
              <Title>Customer Analytics</Title>
              <Text>Customer acquisition and engagement metrics</Text>
              <AreaChart
                className="mt-6 h-80"
                data={salesData}
                index="month"
                categories={['customers']}
                colors={['indigo']}
                valueFormatter={(value) => value.toLocaleString()}
              />
            </Card>
        </TabsContent>
        <TabsContent value="sales">
            <Card>
              <Title>Inventory Levels</Title>
              <Text>Current stock status by category</Text>
              <BarChart
                className="mt-6 h-80"
                data={categoryData}
                index="category"
                categories={['items']}
                colors={['blue']}
                valueFormatter={(value) => value.toLocaleString()}
                yAxisWidth={60}
              />
            </Card>
        </TabsContent>
        </Tabs>
    </div>
  );
}
