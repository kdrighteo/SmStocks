'use client';

import { Card, Title, Text, Metric, Badge, LineChart } from '@tremor/react';
import { ShoppingBag, TrendingUp, CreditCard } from 'lucide-react';

const salesData = [
  { date: 'Jan', sales: 4000 },
  { date: 'Feb', sales: 3000 },
  { date: 'Mar', sales: 5000 },
  { date: 'Apr', sales: 4780 },
  { date: 'May', sales: 5890 },
  { date: 'Jun', sales: 6390 },
];

export default function SalesPage() {
  const totalSales = salesData.reduce((sum, month) => sum + month.sales, 0);
  const growthRate = ((salesData[5].sales - salesData[4].sales) / salesData[4].sales) * 100;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Sales Dashboard</h1>
        <p className="text-gray-600">Monitor your sales performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Text>Total Sales</Text>
              <Metric className="mt-2">{formatCurrency(totalSales)}</Metric>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
              <ShoppingBag className="h-6 w-6" />
            </div>
          </div>
          <div className={`mt-4 text-sm ${growthRate >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {growthRate >= 0 ? '↑' : '↓'} {Math.abs(growthRate).toFixed(1)}% from last month
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Text>Avg. Order Value</Text>
              <Metric className="mt-2">$32.45</Metric>
            </div>
            <div className="p-3 rounded-lg bg-green-50 text-green-600">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 text-sm text-emerald-600">
            +5.4% from last month
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Text>Total Orders</Text>
              <Metric className="mt-2">908</Metric>
            </div>
            <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
              <CreditCard className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 text-sm text-emerald-600">
            +12.3% from last month
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <Title>Sales Overview</Title>
        <Text>Monthly sales performance</Text>
        <LineChart
          className="mt-6 h-80"
          data={salesData}
          index="date"
          categories={['sales']}
          colors={['blue']}
          valueFormatter={(value) => `$${value.toLocaleString()}`}
        />
      </Card>
    </div>
  );
}
