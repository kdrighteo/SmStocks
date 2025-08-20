'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCartIcon, CurrencyDollarIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';

// Dummy data for recent transactions
const recentTransactions = [
  { id: 1, customer: 'John Doe', amount: 1299.99, items: 3, time: '10 min ago', status: 'completed' },
  { id: 2, customer: 'Jane Smith', amount: 899.99, items: 2, time: '25 min ago', status: 'completed' },
  { id: 3, customer: 'Mike Johnson', amount: 249.99, items: 1, time: '1 hour ago', status: 'completed' },
  { id: 4, customer: 'Sarah Williams', amount: 349.99, items: 2, time: '2 hours ago', status: 'completed' },
];

export default function CashierDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== 'cashier') {
      router.push('/dashboard/admin');
    }
  }, [user, router]);

  if (!user || user.role !== 'cashier') {
    return null;
  }

  const stats = [
    { name: 'Today\'s Sales', value: '$2,499.96', change: '+12%', changeType: 'increase' },
    { name: 'Transactions', value: '4', change: '+2.02%', changeType: 'increase' },
    { name: 'Items Sold', value: '8', change: '+4.05%', changeType: 'increase' },
    { name: 'Average Order', value: '$624.99', change: '+4.05%', changeType: 'increase' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Welcome back, {user.name}!</h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's what's happening with your sales today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, statIdx) => (
          <div key={statIdx} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  {statIdx === 0 && <CurrencyDollarIcon className="h-6 w-6 text-white" />}
                  {statIdx === 1 && <ShoppingCartIcon className="h-6 w-6 text-white" />}
                  {statIdx === 2 && <UserGroupIcon className="h-6 w-6 text-white" />}
                  {statIdx === 3 && <ClockIcon className="h-6 w-6 text-white" />}
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span className={`font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>{' '}
                from yesterday
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/dashboard/cashier/pos"
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <ShoppingCartIcon className="h-5 w-5 mr-2" />
              New Sale
            </Link>
            <button
              type="button"
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <CurrencyDollarIcon className="h-5 w-5 mr-2 text-gray-500" />
              Process Return
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <UserGroupIcon className="h-5 w-5 mr-2 text-gray-500" />
              Customer Lookup
            </button>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white shadow rounded-lg lg:col-span-2">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h2>
            <div className="flow-root">
              <ul className="divide-y divide-gray-200">
                {recentTransactions.map((transaction) => (
                  <li key={transaction.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {transaction.customer}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {transaction.items} items • {transaction.time}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          ${transaction.amount.toFixed(2)}
                        </p>
                        <div className="mt-1 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {transaction.status}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <Link
                href="/dashboard/cashier/transactions"
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                View all transactions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
