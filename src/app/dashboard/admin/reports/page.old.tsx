'use client';

import { Card, Title, Text, Tab, TabGroup, TabList, TabPanel, TabPanels, Metric, Badge } from '@/components/ui/tremor-replacements';
import { Button } from '@/components/ui/button';
import { Download, BarChart2, TrendingUp, ShoppingBag, Users, Tag, Package } from 'lucide-react';

const metrics = [
  { title: 'Total Sales', value: '$45,231.89', change: '+20.1%', changeType: 'positive', icon: ShoppingBag },
  { title: 'Total Orders', value: '1,234', change: '+12.3%', changeType: 'positive', icon: Tag },
  { title: 'Products Sold', value: '5,234', change: '+19.2%', changeType: 'positive', icon: Package },
  { title: 'New Customers', value: '268', change: '-2.3%', changeType: 'negative', icon: Users },
];

export default function ReportsPage() {
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Title>Reports</Title>
          <Text>View and analyze your business performance</Text>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <TabGroup>
        <TabList className="mb-8">
          <Tab>Overview</Tab>
          <Tab>Sales</Tab>
          <Tab>Products</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              {metrics.map((metric) => (
                <Card key={metric.title} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Text className="text-sm text-gray-500">{metric.title}</Text>
                      <Metric className="mt-2">{metric.value}</Metric>
                    </div>
                    <Badge color={metric.changeType === 'positive' ? 'emerald' : 'red'}>
                      {metric.change}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
            <Card className="p-6">
              <Title>Revenue</Title>
              <Text>Sales over time</Text>
              <div className="h-64 mt-4 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart2 className="h-10 w-10 mx-auto text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Sales chart will appear here</p>
                </div>
              </div>
            </Card>
          </TabPanel>
          <TabPanel>
            <Card className="p-6">
              <Title>Sales Reports</Title>
              <Text>Detailed sales reports and analytics</Text>
              <div className="h-64 mt-4 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="h-10 w-10 mx-auto text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Sales reports will appear here</p>
                </div>
              </div>
            </Card>
          </TabPanel>
          <TabPanel>
            <Card className="p-6">
              <Title>Product Reports</Title>
              <Text>Product performance and inventory reports</Text>
              <div className="h-64 mt-4 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Package className="h-10 w-10 mx-auto text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Product reports will appear here</p>
                </div>
              </div>
            </Card>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </main>
  );
}
