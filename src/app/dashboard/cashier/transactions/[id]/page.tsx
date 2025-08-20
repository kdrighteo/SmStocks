'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon, PrinterIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

// Simplified transaction data
const transactionDetails = {
  'TXN-1001': {
    id: 'TXN-1001',
    date: '2023-06-15',
    time: '10:30 AM',
    customer: 'Kwame Mensah',
    items: [
      { id: 1, name: 'Modern Sofa Set', price: 1299.99, quantity: 1, total: 1299.99 },
      { id: 3, name: 'Coffee Table', price: 249.99, quantity: 1, total: 249.99 },
    ],
    subtotal: 1549.98,
    tax: 232.50,
    total: 1782.48,
    paymentMethod: 'momo',
    status: 'completed',
    cashier: 'Ama Osei'
  }
};

type Transaction = typeof transactionDetails['TXN-1001'];

export default function TransactionDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const transaction = transactionDetails[id as keyof typeof transactionDetails] as Transaction | undefined;

  if (!transaction) {
    return (
      <div className="p-6">
        <button onClick={() => router.back()} className="flex items-center text-indigo-600 hover:text-indigo-900 mb-6">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Transactions
        </button>
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Transaction not found</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => router.back()} className="flex items-center text-indigo-600 hover:text-indigo-900">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Transactions
        </button>
        <div className="space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <PrinterIcon className="-ml-1 mr-2 h-5 w-5" />
            Print Receipt
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700">
            <ArrowPathIcon className="-ml-1 mr-2 h-5 w-5" />
            Process Refund
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Transaction #{transaction.id}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {transaction.date} at {transaction.time} • {transaction.cashier}
          </p>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Items</h4>
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transaction.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      GHS {item.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      GHS {item.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="flex justify-between py-2 text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span>GHS {transaction.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 text-sm">
              <span className="text-gray-500">Tax (15%)</span>
              <span>GHS {transaction.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 text-sm font-medium border-t border-gray-200 mt-2 pt-3">
              <span>Total</span>
              <span className="text-lg">GHS {transaction.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
