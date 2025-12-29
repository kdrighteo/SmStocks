'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

export type ProductStatus = 'in_stock' | 'low_stock' | 'out_of_stock';
export type ProductCategory = 'sofas' | 'dining' | 'beds' | 'chairs' | 'tables' | 'storage';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  price: number;
  stock: number;
  status: ProductStatus;
  imageUrl?: string;
}

const mockProducts: Product[] = [
  {
    id: 'PROD-001',
    name: 'Modern Leather Sofa',
    sku: 'FUR-SOF-001',
    category: 'sofas',
    price: 1299.99,
    stock: 15,
    status: 'in_stock',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'PROD-002',
    name: 'Dining Table Set',
    sku: 'FUR-DIN-001',
    category: 'dining',
    price: 899.99,
    stock: 3,
    status: 'low_stock',
  },
  {
    id: 'PROD-003',
    name: 'King Size Bed Frame',
    sku: 'FUR-BED-001',
    category: 'beds',
    price: 1599.99,
    stock: 0,
    status: 'out_of_stock',
  },
  {
    id: 'PROD-004',
    name: 'Ergonomic Office Chair',
    sku: 'FUR-CHA-001',
    category: 'chairs',
    price: 349.99,
    stock: 8,
    status: 'in_stock',
  },
  {
    id: 'PROD-005',
    name: 'Coffee Table',
    sku: 'FUR-TAB-002',
    category: 'tables',
    price: 249.99,
    stock: 5,
    status: 'low_stock',
  },
];

type ProductContextType = {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  updateStock: (id: string, newStock: number) => void;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);

  // Load products from localStorage on mount
  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      try {
        setProducts(JSON.parse(storedProducts));
      } catch (error) {
        console.error('Failed to load products from localStorage:', error);
      }
    }
  }, []);

  // Save products to localStorage whenever products change
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `PROD-${String(products.length + 1).padStart(6, '0')}`,
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === id ? { ...product, ...updates } : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const getProductById = (id: string): Product | undefined => {
    return products.find(product => product.id === id);
  };

  const updateStock = (id: string, newStock: number) => {
    const status: ProductStatus =
      newStock === 0 ? 'out_of_stock' : newStock <= 5 ? 'low_stock' : 'in_stock';

    updateProduct(id, { stock: newStock, status });
  };

  return (
    <ProductContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductById,
      updateStock,
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export default ProductContext;