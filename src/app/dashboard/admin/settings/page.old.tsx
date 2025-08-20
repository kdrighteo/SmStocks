'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { 
  Card, Title, Text, Button, Tab, TabGroup, TabList, TabPanel, TabPanels, 
  TextInput, Select, SelectItem, Toggle, Badge 
} from '@tremor/react';
import { Settings, Store, CreditCard, Bell } from 'lucide-react';

type SettingsTab = 'store' | 'payments' | 'notifications';

type StoreSettings = {
  name: string;
  email: string;
  phone: string;
  currency: string;
};

type PaymentSettings = {
  stripe: boolean;
  paypal: boolean;
  bankTransfer: boolean;
  cashOnDelivery: boolean;
};

type NotificationSettings = {
  email: boolean;
  lowStock: boolean;
  newOrder: boolean;
};

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTab>('store');
  const [isSaving, setIsSaving] = useState(false);
  
  const [store, setStore] = useState<StoreSettings>({
    name: 'Furniture Showroom',
    email: 'contact@furnitureshowroom.com',
    phone: '(555) 123-4567',
    currency: 'USD',
  });
  
  const [payments, setPayments] = useState<PaymentSettings>({
    stripe: true,
    paypal: true,
    bankTransfer: true,
    cashOnDelivery: true,
  });
  
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    lowStock: true,
    newOrder: true,
  });
  
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };
  
  if (!user) return null;
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Title>Settings</Title>
          <Text>Manage your store settings</Text>
        </div>
        <Button 
          loading={isSaving}
          onClick={handleSave}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
      
      <TabGroup onIndexChange={(i) => setActiveTab(i === 0 ? 'store' : i === 1 ? 'payments' : 'notifications')}>
        <TabList>
          <Tab icon={Store}>Store</Tab>
          <Tab icon={CreditCard}>Payments</Tab>
          <Tab icon={Bell}>Notifications</Tab>
        </TabList>
        
        <TabPanels>
          {/* Store Settings */}
          <TabPanel>
            <Card className="p-6">
              <Title className="mb-6">Store Information</Title>
              <div className="space-y-4">
                <div>
                  <Text>Store Name</Text>
                  <TextInput 
                    className="mt-1" 
                    value={store.name}
                    onChange={(e) => setStore({...store, name: e.target.value})}
                  />
                </div>
                <div>
                  <Text>Contact Email</Text>
                  <TextInput 
                    className="mt-1" 
                    type="email"
                    value={store.email}
                    onChange={(e) => setStore({...store, email: e.target.value})}
                  />
                </div>
                <div>
                  <Text>Phone Number</Text>
                  <TextInput 
                    className="mt-1" 
                    value={store.phone}
                    onChange={(e) => setStore({...store, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Text>Currency</Text>
                  <Select 
                    className="mt-1"
                    value={store.currency}
                    onValueChange={(value) => setStore({...store, currency: value})}
                  >
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                  </Select>
                </div>
              </div>
            </Card>
          </TabPanel>
          
          {/* Payment Settings */}
          <TabPanel>
            <Card className="p-6">
              <Title className="mb-6">Payment Methods</Title>
              <div className="space-y-4">
                {Object.entries(payments).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                    <Text className="font-medium">
                      {key.split(/(?=[A-Z])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Text>
                    <Toggle
                      color="blue"
                      checked={value}
                      onChange={() => setPayments({...payments, [key]: !value})}
                    />
                  </div>
                ))}
              </div>
            </Card>
          </TabPanel>
          
          {/* Notification Settings */}
          <TabPanel>
            <Card className="p-6">
              <Title className="mb-6">Notification Preferences</Title>
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                    <Text className="font-medium">
                      {key === 'email' ? 'Email Notifications' : 
                       key === 'lowStock' ? 'Low Stock Alerts' : 'New Order Alerts'}
                    </Text>
                    <Toggle
                      color="blue"
                      checked={value}
                      onChange={() => setNotifications({...notifications, [key]: !value})}
                    />
                  </div>
                ))}
              </div>
            </Card>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
