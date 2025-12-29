'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, Title, Text, Button } from '@/components/ui/tremor-replacements';
import { ArrowLeft, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

export default function ReturnsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [transaction, setTransaction] = useState<any>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'cashier') {
      router.push('/auth/login');
    }
  }, [user, router]);

  const handleLookup = () => {
    if (!transactionId.trim()) {
      setError('Please enter a transaction ID');
      return;
    }
    
    // Simulate API call
    setIsProcessing(true);
    setError('');
    setSuccess('');
    
    setTimeout(() => {
      // Mock response
      if (transactionId === '12345') {
        setTransaction({
          id: '12345',
          date: '2023-05-15',
          items: [
            { id: '1', name: 'Modern Sofa', price: 1200, quantity: 1 },
            { id: '2', name: 'Coffee Table', price: 350, quantity: 2 }
          ],
          total: 1900,
          paymentMethod: 'Credit Card'
        });
      } else {
        setError('Transaction not found');
        setTransaction(null);
      }
      setIsProcessing(false);
    }, 1000);
  };

  const handleProcessReturn = () => {
    if (!transaction) return;
    
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setSuccess('Return processed successfully');
      setTransaction(null);
      setTransactionId('');
      setIsProcessing(false);
    }, 1500);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => router.back()}
          className="mr-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Process Return</h1>
          <p className="text-gray-600">Process returns and issue refunds to customers</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="mb-6">
          <Title>Lookup Transaction</Title>
          <div className="mt-4 flex space-x-2">
            <div className="flex-1">
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter transaction ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={isProcessing}
              />
            </div>
            <button
              onClick={handleLookup}
              disabled={isProcessing}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : 'Lookup'}
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          {success && <p className="mt-2 text-sm text-green-600">{success}</p>}
        </Card>

        {transaction && (
          <Card className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <Title>Transaction #{transaction.id}</Title>
              <div className="text-sm text-gray-500">
                {new Date(transaction.date).toLocaleDateString()}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-medium mb-2">Items</h3>
                <div className="space-y-2">
                  {transaction.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-b pb-4">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${transaction.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Payment Method</span>
                  <span>{transaction.paymentMethod}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4">
                <span className="text-lg font-bold">Refund Amount</span>
                <span className="text-lg font-bold text-green-600">${transaction.total.toFixed(2)}</span>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={handleProcessReturn}
                  disabled={isProcessing}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Process Return & Issue Refund'
                  )}
                </button>
              </div>
            </div>
          </Card>
        )}
        
        <Card>
          <Title className="text-lg font-medium mb-4">Return Policy</Title>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Items must be returned within 30 days of purchase</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Items must be in original condition with all tags attached</span>
            </li>
            <li className="flex items-start">
              <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Final sale items are not eligible for return</span>
            </li>
            <li className="flex items-start">
              <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Custom or special order items may not be returned</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
