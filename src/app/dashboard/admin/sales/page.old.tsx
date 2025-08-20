'use client';

import { Card, Title, Text, Metric, Badge, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react';
import { Download, ShoppingBag, TrendingUp, CreditCard, Banknote, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const salesData = [
  { date: 'Jan', sales: 4000, orders: 124, avgOrder: 32.26 },
  { date: 'Feb', sales: 3000, orders: 98, avgOrder: 30.61 },
  { date: 'Mar', sales: 5000, orders: 156, avgOrder: 32.05 },
  { date: 'Apr', sales: 4780, orders: 142, avgOrder: 33.66 },
  { date: 'May', sales: 5890, orders: 187, avgOrder: 31.50 },
  { date: 'Jun', sales: 6390, orders: 201, avgOrder: 31.79 },
];

const paymentMethods = [
  { name: 'Credit Card', value: 12500, percentage: 45 },
  { name: 'Mobile Money', value: 9800, percentage: 35 },
  { name: 'Bank Transfer', value: 3500, percentage: 13 },
  { name: 'Cash', value: 1700, percentage: 7 },
];

export default function SalesPage() {
  const totalSales = salesData.reduce((sum, month) => sum + month.sales, 0);
  const totalOrders = salesData.reduce((sum, month) => sum + month.orders, 0);
  const avgOrderValue = totalSales / totalOrders;
  const growthRate = ((salesData[5].sales - salesData[4].sales) / salesData[4].sales) * 100;

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Title>Sales Dashboard</Title>
          <Text>Track and analyze your sales performance</Text>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50">
            <Download className="mr-2 h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text>Total Sales</Text>
              <Metric>${totalSales.toLocaleString()}</Metric>
              <div className="mt-2 flex items-center">
                {growthRate >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <span className={`ml-1 text-sm ${growthRate >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {Math.abs(growthRate).toFixed(1)}% from last month
                </span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text>Total Orders</Text>
              <Metric>{totalOrders}</Metric>
              <Text className="mt-2">+12.5% from last month</Text>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <ShoppingBag className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text>Avg. Order Value</Text>
              <Metric>${avgOrderValue.toFixed(2)}</Metric>
              <Text className="mt-2">+2.3% from last month</Text>
            </div>
            <div className="p-3 rounded-lg bg-purple-50">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Text>Conversion Rate</Text>
              <Metric>3.2%</Metric>
              <Text className="mt-2">+0.5% from last month</Text>
            </div>
            <div className="p-3 rounded-lg bg-amber-50">
              <TrendingUp className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </Card>
      </div>

      <TabGroup className="mb-8">
        <TabList>
          <Tab>Overview</Tab>
          <Tab>Payment Methods</Tab>
          <Tab>Categories</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Card className="p-6">
              <Title>Sales Overview</Title>
              <Text>Monthly sales performance</Text>
              <div className="h-80 mt-4 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="h-10 w-10 mx-auto text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Sales chart will appear here</p>
                </div>
              </div>
            </Card>
          </TabPanel>
          <TabPanel>
            <Card className="p-6">
              <Title>Payment Methods</Title>
              <Text>Breakdown of sales by payment method</Text>
              <div className="mt-6 space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.name} className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{method.name}</span>
                      <span className="font-medium">${method.value.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${method.percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-xs text-gray-500 mt-1">{method.percentage}%</div>
                  </div>
                ))}
              </div>
            </Card>
          </TabPanel>
          <TabPanel>
            <Card className="p-6">
              <Title>Sales by Category</Title>
              <Text>Top performing categories</Text>
              <div className="h-80 mt-4 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <ShoppingBag className="h-10 w-10 mx-auto text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Category breakdown will appear here</p>
                </div>
              </div>
            </Card>
          </TabPanel>
        </TabPanels>
      </TabGroup>

      <Card className="p-6">
        <Title>Recent Transactions</Title>
        <Text>Latest sales transactions</Text>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#ORD-1001</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">John Doe</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-06-15</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$1,299.99</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Completed
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#ORD-1000</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jane Smith</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-06-14</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$899.99</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Processing
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  );
}
