'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon, ArrowDownTrayIcon, EyeIcon, ReceiptPercentIcon } from '@heroicons/react/24/outline';

type Transaction = {
  id: string;
  date: string;
  time: string;
  customer: string;
  items: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'momo' | 'bank';
  status: 'completed' | 'refunded' | 'pending';
};

export default function TransactionsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('today');
  const [paymentMethod, setPaymentMethod] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Dummy transaction data
  const transactions: Transaction[] = [
    {
      id: 'TXN-1001',
      date: '2023-06-15',
      time: '10:30 AM',
      customer: 'Kwame Mensah',
      items: 3,
      total: 1250.50,
      paymentMethod: 'momo',
      status: 'completed'
    },
    {
      id: 'TXN-1002',
      date: '2023-06-15',
      time: '11:45 AM',
      customer: 'Ama Osei',
      items: 5,
      total: 3450.00,
      paymentMethod: 'card',
      status: 'completed'
    },
    {
      id: 'TXN-1003',
      date: '2023-06-14',
      time: '03:20 PM',
      customer: 'Kofi Asare',
      items: 2,
      total: 899.99,
      paymentMethod: 'cash',
      status: 'refunded'
    },
    {
      id: 'TXN-1004',
      date: '2023-06-14',
      time: '04:15 PM',
      customer: 'Esi Mensah',
      items: 1,
      total: 249.99,
      paymentMethod: 'bank',
      status: 'completed'
    },
    {
      id: 'TXN-1005',
      date: '2023-06-13',
      time: '01:10 PM',
      customer: 'Yaw Boateng',
      items: 4,
      total: 2100.00,
      paymentMethod: 'card',
      status: 'pending'
    },
  ];

  // Filter transactions based on search and filters
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = dateRange === 'all' || 
      (dateRange === 'today' && transaction.date === '2023-06-15') ||
      (dateRange === 'yesterday' && transaction.date === '2023-06-14') ||
      (dateRange === 'week' && ['2023-06-09', '2023-06-10', '2023-06-11', '2023-06-12', '2023-06-13', '2023-06-14', '2023-06-15'].includes(transaction.date));
    
    const matchesPayment = paymentMethod === 'all' || 
      transaction.paymentMethod === paymentMethod;
    
    const matchesStatus = statusFilter === 'all' || 
      transaction.status === statusFilter;
    
    return matchesSearch && matchesDate && matchesPayment && matchesStatus;
  });

  // Calculate summary
  const totalSales = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.total, 0);
  
  const totalTransactions = transactions.filter(t => t.status === 'completed').length;
  const averageTransaction = totalTransactions > 0 ? totalSales / totalTransactions : 0;

  const handleViewDetails = (transactionId: string) => {
    router.push(`/dashboard/cashier/transactions/${transactionId}`);
  };

  const handleExport = () => {
    // In a real app, this would generate and download a CSV/Excel file
    alert('Exporting transactions...');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <button
          onClick={handleExport}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
          Export
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-500">Total Sales</p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">
            GHS {totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="mt-2 text-sm text-gray-500">All time</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-500">Total Transactions</p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">
            {totalTransactions}
          </p>
          <p className="mt-2 text-sm text-gray-500">All time</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-500">Avg. Transaction</p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">
            GHS {averageTransaction.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="mt-2 text-sm text-gray-500">All time</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2 border"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="date-range" className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select
              id="date-range"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">Last 7 days</option>
              <option value="all">All time</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="payment-method" className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <select
              id="payment-method"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="all">All Methods</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="momo">Mobile Money</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="status"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="refunded">Refunded</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                      {transaction.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{transaction.date}</div>
                      <div className="text-gray-400">{transaction.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.items}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      GHS {transaction.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.paymentMethod === 'cash' ? 'bg-yellow-100 text-yellow-800' :
                        transaction.paymentMethod === 'card' ? 'bg-blue-100 text-blue-800' :
                        transaction.paymentMethod === 'momo' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {transaction.paymentMethod.charAt(0).toUpperCase() + transaction.paymentMethod.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'refunded' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(transaction.id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                        title="View Details"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        title="Print Receipt"
                      >
                        <ReceiptPercentIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
