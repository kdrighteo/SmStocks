'use client';

import { useState } from 'react';
import { 
  Card, Title, Text, Button, Tab, TabGroup, TabList, 
  TabPanel, TabPanels, TextInput, Select, SelectItem, Toggle, Switch
} from '@tremor/react';
import { Settings, Store, CreditCard, Bell, Save } from 'lucide-react';

type SettingsTab = 'store' | 'payments' | 'notifications';

type StoreSettings = {
  storeName: string;
  email: string;
  phone: string;
  currency: string;
  timezone: string;
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
  orderUpdates: boolean;
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('store');
  const [isSaving, setIsSaving] = useState(false);
  
  // Store settings state
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    storeName: 'Furniture Store',
    email: 'info@furniturestore.com',
    phone: '+1 (555) 123-4567',
    currency: 'USD',
    timezone: 'UTC-05:00',
  });

  // Payment settings state
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    stripe: true,
    paypal: true,
    bankTransfer: true,
    cashOnDelivery: true,
  });

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: true,
    lowStock: true,
    newOrder: true,
    orderUpdates: true,
  });

  const handleStoreChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStoreSettings(prev => ({ ...prev, [name]: value }));
  };

  const togglePayment = (method: keyof PaymentSettings) => {
    setPaymentSettings(prev => ({ ...prev, [method]: !prev[method] }));
  };

  const toggleNotification = (setting: keyof NotificationSettings) => {
    setNotificationSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-600">Manage your store settings</p>
        </div>
        <Button icon={Save} loading={isSaving} onClick={handleSubmit}>
          Save Changes
        </Button>
      </div>

      <TabGroup 
        index={['store', 'payments', 'notifications'].indexOf(activeTab)}
        onIndexChange={(i) => setActiveTab(['store', 'payments', 'notifications'][i] as SettingsTab)}
      >
        <TabList className="mb-6">
          <Tab icon={Store}>Store</Tab>
          <Tab icon={CreditCard}>Payments</Tab>
          <Tab icon={Bell}>Notifications</Tab>
        </TabList>

        <form onSubmit={handleSubmit}>
          <TabPanels>
            {/* Store Settings */}
            <TabPanel>
              <Card className="space-y-6">
                <Title>Store Information</Title>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Store Name</label>
                    <TextInput
                      name="storeName"
                      value={storeSettings.storeName}
                      onChange={handleStoreChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <TextInput
                      name="email"
                      type="email"
                      value={storeSettings.email}
                      onChange={handleStoreChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <TextInput
                      name="phone"
                      value={storeSettings.phone}
                      onChange={handleStoreChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Currency</label>
                    <Select
                      name="currency"
                      value={storeSettings.currency}
                      onValueChange={(value) => 
                        setStoreSettings(prev => ({ ...prev, currency: value }))
                      }
                    >
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                      <SelectItem value="GBP">British Pound (£)</SelectItem>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Timezone</label>
                    <Select
                      name="timezone"
                      value={storeSettings.timezone}
                      onValueChange={(value) => 
                        setStoreSettings(prev => ({ ...prev, timezone: value }))
                      }
                    >
                      <SelectItem value="UTC-05:00">(UTC-05:00) Eastern Time</SelectItem>
                      <SelectItem value="UTC-06:00">(UTC-06:00) Central Time</SelectItem>
                      <SelectItem value="UTC-07:00">(UTC-07:00) Mountain Time</SelectItem>
                      <SelectItem value="UTC-08:00">(UTC-08:00) Pacific Time</SelectItem>
                    </Select>
                  </div>
                </div>
              </Card>
            </TabPanel>

            {/* Payment Settings */}
            <TabPanel>
              <Card className="space-y-6">
                <Title>Payment Methods</Title>
                <Text>Enable or disable payment methods for your store</Text>
                
                <div className="space-y-4">
                  {[
                    { id: 'stripe', label: 'Stripe', value: paymentSettings.stripe },
                    { id: 'paypal', label: 'PayPal', value: paymentSettings.paypal },
                    { id: 'bankTransfer', label: 'Bank Transfer', value: paymentSettings.bankTransfer },
                    { id: 'cashOnDelivery', label: 'Cash on Delivery', value: paymentSettings.cashOnDelivery },
                  ].map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{method.label}</h3>
                        <p className="text-sm text-gray-500">
                          {method.id === 'stripe' && 'Credit card payments via Stripe'}
                          {method.id === 'paypal' && 'Pay with PayPal'}
                          {method.id === 'bankTransfer' && 'Direct bank transfer'}
                          {method.id === 'cashOnDelivery' && 'Pay with cash upon delivery'}
                        </p>
                      </div>
                      <Switch
                        checked={method.value}
                        onChange={() => togglePayment(method.id as keyof PaymentSettings)}
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </TabPanel>

            {/* Notification Settings */}
            <TabPanel>
              <Card className="space-y-6">
                <Title>Email Notifications</Title>
                <Text>Manage your email notification preferences</Text>
                
                <div className="space-y-4">
                  {[
                    { id: 'email', label: 'Email Notifications', description: 'Enable all email notifications' },
                    { id: 'lowStock', label: 'Low Stock Alerts', description: 'Get notified when stock is low' },
                    { id: 'newOrder', label: 'New Order Alerts', description: 'Get notified for new orders' },
                    { id: 'orderUpdates', label: 'Order Status Updates', description: 'Get notified for order status changes' },
                  ].map((setting) => (
                    <div key={setting.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{setting.label}</h3>
                        <p className="text-sm text-gray-500">{setting.description}</p>
                      </div>
                      <Switch
                        checked={notificationSettings[setting.id as keyof NotificationSettings] as boolean}
                        onChange={() => toggleNotification(setting.id as keyof NotificationSettings)}
                        className="mt-1"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </TabPanel>
          </TabPanels>
        </form>
      </TabGroup>
    </div>
  );
}
