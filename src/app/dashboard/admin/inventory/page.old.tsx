'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

// Dummy data for inventory items
const initialInventory = [
  { id: 1, name: 'Modern Sofa Set', category: 'Living Room', sku: 'SOFA-001', price: 1299.99, cost: 799.99, quantity: 15, lowStockThreshold: 5 },
  { id: 2, name: 'Dining Table Set', category: 'Dining', sku: 'DINE-001', price: 899.99, cost: 499.99, quantity: 8, lowStockThreshold: 3 },
  { id: 3, name: 'King Size Bed Frame', category: 'Bedroom', sku: 'BED-001', price: 699.99, cost: 399.99, quantity: 12, lowStockThreshold: 4 },
  { id: 4, name: 'Office Desk', category: 'Office', sku: 'DESK-001', price: 349.99, cost: 199.99, quantity: 20, lowStockThreshold: 5 },
  { id: 5, name: 'Coffee Table', category: 'Living Room', sku: 'TBL-001', price: 249.99, cost: 149.99, quantity: 2, lowStockThreshold: 3 },
];

export default function InventoryPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [inventory, setInventory] = useState(initialInventory);
  
  const categories = ['All', ...new Set(inventory.map(item => item.category))];
  
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setInventory(inventory.filter(item => item.id !== id));
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    const newItem = {
      id: inventory.length + 1,
      name: e.target.name.value,
      category: e.target.category.value,
      sku: e.target.sku.value,
      price: parseFloat(e.target.price.value),
      cost: parseFloat(e.target.cost.value),
      quantity: parseInt(e.target.quantity.value, 10),
      lowStockThreshold: parseInt(e.target.lowStockThreshold.value, 10),
    };
    setInventory([...inventory, newItem]);
    setIsAddModalOpen(false);
  };

  if (!user || user.role !== 'admin') {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Inventory</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Item
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search items..."
            className="w-full p-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="p-2 border rounded-md"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Inventory Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">In Stock</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInventory.map((item) => (
              <tr key={item.id} className={item.quantity <= item.lowStockThreshold ? 'bg-red-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium">{item.name}</div>
                  {item.quantity <= item.lowStockThreshold && (
                    <span className="text-xs text-red-600">Low Stock</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.category}</td>
                <td className="px-6 py-4 whitespace-nowrap font-mono">{item.sku}</td>
                <td className="px-6 py-4 whitespace-nowrap">${item.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.quantity <= item.lowStockThreshold 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {item.quantity} in stock
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" name="name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select name="category" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                  <option value="">Select category</option>
                  {categories.filter(c => c !== 'All').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">SKU</label>
                <input type="text" name="sku" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                  <input type="number" step="0.01" name="price" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cost ($)</label>
                  <input type="number" step="0.01" name="cost" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input type="number" name="quantity" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Low Stock Threshold</label>
                  <input type="number" name="lowStockThreshold" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
