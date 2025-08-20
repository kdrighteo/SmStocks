'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { PlusIcon, MinusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Dummy product data
const products = [
  { id: 1, name: 'Modern Sofa Set', price: 1299.99, sku: 'SOFA-001', stock: 15 },
  { id: 2, name: 'Dining Table Set', price: 899.99, sku: 'DINE-001', stock: 8 },
  { id: 3, name: 'King Size Bed Frame', price: 699.99, sku: 'BED-001', stock: 12 },
  { id: 4, name: 'Office Desk', price: 349.99, sku: 'DESK-001', stock: 20 },
  { id: 5, name: 'Coffee Table', price: 249.99, sku: 'TBL-001', stock: 2 },
  { id: 6, name: 'Bookshelf', price: 199.99, sku: 'SHELF-001', stock: 10 },
  { id: 7, name: 'Armchair', price: 299.99, sku: 'CHAIR-001', stock: 5 },
  { id: 8, name: 'TV Stand', price: 179.99, sku: 'TVS-001', stock: 7 },
];

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  sku: string;
  discount: number; // Percentage discount (0-100)
  discountAmount: number; // Calculated discount amount
};

type PaymentMethod = 'cash' | 'card' | 'momo' | 'bank';

export default function POSPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [amountTendered, setAmountTendered] = useState('');
  const [change, setChange] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [discountItemId, setDiscountItemId] = useState<number | null>(null);

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate cart totals with discounts
  const calculateItemTotal = (item: CartItem) => {
    const itemSubtotal = item.price * item.quantity;
    const discount = item.discountAmount > 0 
      ? item.discountAmount 
      : (item.discount / 100) * itemSubtotal;
    return itemSubtotal - discount;
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalDiscount = cart.reduce((sum, item) => {
    const itemSubtotal = item.price * item.quantity;
    const discount = item.discountAmount > 0 
      ? item.discountAmount 
      : (item.discount / 100) * itemSubtotal;
    return sum + discount;
  }, 0);
  const tax = (subtotal - totalDiscount) * 0.15; // 15% tax on discounted amount
  const total = subtotal - totalDiscount + tax;

  // Add item to cart
  const addToCart = (product: typeof products[0]) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      
      if (existingItem) {
        // Check stock before increasing quantity
        if (existingItem.quantity >= product.stock) {
          alert('Not enough stock available');
          return prevCart;
        }
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Check stock before adding new item
        if (product.stock < 1) {
          alert('Item out of stock');
          return prevCart;
        }
        return [...prevCart, { 
          ...product, 
          quantity: 1, 
          discount: 0,
          discountAmount: 0 
        }];
      }
    });
  };

  // Apply discount to item or entire cart
  const applyDiscount = () => {
    if (!discountValue || isNaN(Number(discountValue))) {
      alert('Please enter a valid discount value');
      return;
    }

    const value = parseFloat(discountValue);
    
    if (discountType === 'percentage' && (value < 0 || value > 100)) {
      alert('Discount percentage must be between 0 and 100');
      return;
    }

    setCart(prevCart => {
      if (discountItemId !== null) {
        // Apply to specific item
        return prevCart.map(item => {
          if (item.id === discountItemId) {
            const discount = discountType === 'percentage' ? value : 0;
            const discountAmount = discountType === 'fixed' ? Math.min(value, item.price * item.quantity) : 0;
            return { ...item, discount, discountAmount };
          }
          return item;
        });
      } else {
        // Apply to all items
        return prevCart.map(item => {
          const discount = discountType === 'percentage' ? value : 0;
          const discountAmount = discountType === 'fixed' 
            ? Math.min(value / cart.length, item.price * item.quantity) 
            : 0;
          return { ...item, discount, discountAmount };
        });
      }
    });

    // Reset discount form
    setDiscountValue('');
    setDiscountItemId(null);
    setShowDiscountModal(false);
  };

  // Remove discount from item or entire cart
  const removeDiscount = (itemId?: number) => {
    setCart(prevCart => {
      if (itemId !== undefined) {
        // Remove from specific item
        return prevCart.map(item => 
          item.id === itemId 
            ? { ...item, discount: 0, discountAmount: 0 } 
            : item
        );
      } else {
        // Remove from all items
        return prevCart.map(item => ({
          ...item,
          discount: 0,
          discountAmount: 0
        }));
      }
    });
  };

  // Update item quantity in cart
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }

    // Check stock before updating quantity
    const product = products.find(p => p.id === id);
    if (product && newQuantity > product.stock) {
      alert(`Only ${product.stock} items available in stock`);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item from cart
  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Clear cart
  const clearCart = () => {
    if (cart.length > 0 && window.confirm('Clear the entire cart?')) {
      setCart([]);
    }
  };

  // Calculate change when amount tendered changes
  useEffect(() => {
    if (amountTendered) {
      const tendered = parseFloat(amountTendered);
      if (!isNaN(tendered) && tendered >= total) {
        setChange(parseFloat((tendered - total).toFixed(2)));
      } else {
        setChange(0);
      }
    } else {
      setChange(0);
    }
  }, [amountTendered, total]);

  // Process payment
  const processPayment = () => {
    if (paymentMethod !== 'cash' || (paymentMethod === 'cash' && parseFloat(amountTendered) >= total)) {
      setIsProcessing(true);
      // Simulate API call
      setTimeout(() => {
        alert('Payment processed successfully!');
        setCart([]);
        setShowPaymentModal(false);
        setAmountTendered('');
        setIsProcessing(false);
      }, 1500);
    }
  };

  // Redirect if not cashier
  useEffect(() => {
    if (user && user.role !== 'cashier') {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (!user || user.role !== 'cashier') {
    return null;
  }

  const renderDiscountModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">
            {discountItemId !== null 
              ? `Apply Discount to ${cart.find(i => i.id === discountItemId)?.name}` 
              : 'Apply Discount to All Items'}
          </h3>
          <button 
            onClick={() => {
              setShowDiscountModal(false);
              setDiscountValue('');
              setDiscountItemId(null);
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Type
            </label>
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {discountType === 'percentage' ? 'Discount Percentage' : 'Discount Amount'}
            </label>
            <div className="relative">
              <input
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder={discountType === 'percentage' ? '0-100' : '0.00'}
                min={0}
                max={discountType === 'percentage' ? 100 : undefined}
                step={discountType === 'percentage' ? 1 : 0.01}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500">
                  {discountType === 'percentage' ? '%' : 'GHS'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-2">
            <button
              onClick={() => {
                setShowDiscountModal(false);
                setDiscountValue('');
                setDiscountItemId(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={applyDiscount}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Apply Discount
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCartItem = (item: CartItem) => (
    <li key={item.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{item.name}</h4>
        <div className="text-sm text-gray-500">{item.sku}</div>
        <div className="font-semibold">GHS {item.price.toFixed(2)}</div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="p-1 text-gray-500 hover:text-indigo-600"
        >
          <MinusIcon className="h-4 w-4" />
        </button>
        <span className="w-8 text-center">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="p-1 text-gray-500 hover:text-indigo-600"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex items-center space-x-2">
        {item.discount > 0 || item.discountAmount > 0 ? (
          <button
            onClick={() => removeDiscount(item.id)}
            className="text-xs text-red-600 hover:text-red-800"
            title="Remove discount"
          >
            {item.discount > 0 
              ? `-${item.discount}%` 
              : `-GHS ${item.discountAmount.toFixed(2)}`}
          </button>
        ) : (
          <button
            onClick={() => {
              setDiscountItemId(item.id);
              setDiscountValue('');
              setDiscountType('percentage');
              setShowDiscountModal(true);
            }}
            className="text-xs text-indigo-600 hover:text-indigo-800"
            title="Add discount"
          >
            + Discount
          </button>
        )}
      </div>
    </li>
  );

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] bg-gray-50">
      {/* Product Grid */}
      <div className="lg:w-2/3 p-4 overflow-y-auto">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search products by name or SKU..."
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow p-4 flex flex-col hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => addToCart(product)}
            >
              <div className="h-32 bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Product Image</span>
              </div>
              <h3 className="font-semibold text-gray-900">{product.name}</h3>
              <div className="mt-1 text-sm text-gray-500">{product.sku}</div>
              <div className="mt-2 flex justify-between items-center">
                <span className="font-bold text-gray-900">GHS {product.price.toFixed(2)}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  product.stock > 5 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {product.stock} in stock
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart */}
      <div className="lg:w-1/3 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Current Order</h2>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              <p>Add items to the cart</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {cart.map(renderCartItem)}
            </ul>
          )}
        </div>

        {/* Order Summary */}
        <div className="border-t border-gray-200 p-4">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="font-medium">Subtotal:</span>
              <span>GHS {subtotal.toFixed(2)}</span>
            </div>
            {totalDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span className="font-medium">Discount:</span>
                <span>-GHS {totalDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-medium">Tax (15%):</span>
              <span>GHS {tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 my-2"></div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>GHS {total.toFixed(2)}</span>
            </div>
          </div>
          
          <button
            onClick={() => cart.length > 0 && setShowPaymentModal(true)}
            disabled={cart.length === 0}
            className={`w-full py-3 px-4 rounded-md text-white font-medium ${
              cart.length === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            Process Payment
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div className="mt-4 space-y-2">
                {cart.length > 0 && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setDiscountItemId(null);
                        setDiscountValue('');
                        setDiscountType('percentage');
                        setShowDiscountModal(true);
                      }}
                      className="flex-1 bg-yellow-100 text-yellow-800 py-2 px-4 rounded-md hover:bg-yellow-200 text-sm font-medium"
                    >
                      Apply Cart Discount
                    </button>
                    {totalDiscount > 0 && (
                      <button
                        onClick={() => removeDiscount()}
                        className="bg-red-100 text-red-800 py-2 px-4 rounded-md hover:bg-red-200 text-sm font-medium"
                        title="Remove all discounts"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}
                <button
                  onClick={() => setShowPaymentModal(true)}
                  disabled={cart.length === 0}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Process Payment
                </button>
                <button
                  onClick={() => setCart([])}
                  disabled={cart.length === 0}
                  className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  Clear Cart
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'cash', label: 'Cash' },
                      { id: 'card', label: 'Card' },
                      { id: 'momo', label: 'Mobile Money' },
                      { id: 'bank', label: 'Bank Transfer' },
                    ].map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                        className={`py-2 px-4 border rounded-md text-sm font-medium ${
                          paymentMethod === method.id
                            ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {method.label}
                      </button>
                    ))}
                  </div>
                </div>

                {paymentMethod === 'cash' && (
                  <div>
                    <label htmlFor="amountTendered" className="block text-sm font-medium text-gray-700 mb-1">
                      Amount Tendered
                    </label>
                    <input
                      type="number"
                      id="amountTendered"
                      min={total}
                      step="0.01"
                      value={amountTendered}
                      onChange={(e) => setAmountTendered(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="0.00"
                    />
                    {parseFloat(amountTendered) > 0 && change >= 0 && (
                      <div className="mt-2 text-sm">
                        <span className="text-gray-600">Change Due:</span>{' '}
                        <span className="font-medium">${change.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                )}

                {(paymentMethod === 'card' || paymentMethod === 'momo' || paymentMethod === 'bank') && (
                  <div className="p-4 bg-yellow-50 text-yellow-700 text-sm rounded-md">
                    {paymentMethod === 'card' && (
                      <p>Please process the card payment using the card machine.</p>
                    )}
                    {paymentMethod === 'momo' && (
                      <p>Please process the payment using the Mobile Money app.</p>
                    )}
                    {paymentMethod === 'bank' && (
                      <p>Please process the bank transfer and verify the payment.</p>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
                
                <button
                  onClick={processPayment}
                  disabled={isProcessing || (paymentMethod === 'cash' && (isNaN(parseFloat(amountTendered)) || parseFloat(amountTendered) < total))}
                  className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isProcessing || (paymentMethod === 'cash' && (isNaN(parseFloat(amountTendered)) || parseFloat(amountTendered) < total))
                      ? 'bg-indigo-300 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {isProcessing ? 'Processing...' : 'Complete Payment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
