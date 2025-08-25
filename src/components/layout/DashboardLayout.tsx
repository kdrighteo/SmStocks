'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  Users, 
  UserCog, 
  BarChart2, 
  ShoppingCart, 
  Receipt, 
  RefreshCw, 
  Search,
  Settings,
  Tag,
  FileText,
  Truck,
  AlertCircle,
  Boxes,
  CreditCard,
  Home,
  Users as UsersIcon,
  DollarSign,
  ListChecks,
  FileSpreadsheet,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';

// Memoize the navigation configuration to prevent unnecessary re-renders
const getNavigation = () => [
  { 
    name: 'Dashboard', 
    href: (role: string) => {
      // For admin, go to admin dashboard, for cashier, go to POS
      return role === 'admin' ? '/dashboard/admin' : '/dashboard/cashier/pos';
    },
    roles: ['admin', 'cashier'],
    icon: 'layout-dashboard',
    exact: false
  },
  { 
    name: 'Point of Sale', 
    href: () => '/dashboard/cashier/pos',
    roles: ['cashier'],
    icon: 'shopping-cart',
    exact: true
  },
  // Admin specific routes
  { 
    name: 'Inventory', 
    href: () => '/dashboard/admin/inventory', 
    roles: ['admin'],
    icon: 'package',
    exact: true
  },
  { 
    name: 'Products', 
    href: () => '/dashboard/admin/products', 
    roles: ['admin'],
    icon: 'shopping-bag',
    exact: true
  },
  { 
    name: 'Categories', 
    href: () => '/dashboard/admin/categories', 
    roles: ['admin'],
    icon: 'tag',
    exact: true
  },
  { 
    name: 'Sales', 
    href: () => '/dashboard/admin/sales', 
    roles: ['admin'],
    icon: 'trending-up',
    exact: false
  },
  { 
    name: 'Orders', 
    href: () => '/dashboard/admin/orders', 
    roles: ['admin'],
    icon: 'shopping-cart',
    exact: true
  },
  { 
    name: 'Customers', 
    href: () => '/dashboard/admin/customers', 
    roles: ['admin'],
    icon: 'users',
    exact: true
  },
  { 
    name: 'Users', 
    href: () => '/dashboard/admin/users', 
    roles: ['admin'],
    icon: 'user-cog',
    exact: true
  },
  { 
    name: 'Suppliers', 
    href: () => '/dashboard/admin/suppliers', 
    roles: ['admin'],
    icon: 'truck',
    exact: true
  },
  { 
    name: 'Reports', 
    href: () => '/dashboard/admin/reports', 
    roles: ['admin'],
    icon: 'bar-chart-2',
    exact: true
  },
  { 
    name: 'Settings', 
    href: () => '/dashboard/admin/settings', 
    roles: ['admin'],
    icon: 'settings',
    exact: true
  },
  // Cashier specific routes
  { 
    name: 'Transactions', 
    href: () => '/dashboard/cashier/transactions', 
    roles: ['cashier'],
    icon: 'receipt',
    exact: true
  },
  { 
    name: 'Returns', 
    href: () => '/dashboard/cashier/returns', 
    roles: ['cashier'],
    icon: 'refresh-cw',
    exact: true
  },
  { 
    name: 'Customer Lookup', 
    href: () => '/dashboard/cashier/customers', 
    roles: ['cashier'],
    icon: 'search',
    exact: true
  },
];

// Create a separate component for the icon to prevent recreation on each render
const NavIcon = React.memo(function NavIcon({ icon, className }: { icon: string; className?: string }) {
  const iconMap = useMemo((): Record<string, React.ComponentType<{ className?: string }>> => ({
    'layout-dashboard': LayoutDashboard,
    'package': Package,
    'shopping-bag': ShoppingBag,
    'trending-up': TrendingUp,
    'users': Users,
    'user-cog': UserCog,
    'bar-chart-2': BarChart2,
    'shopping-cart': ShoppingCart,
    'receipt': Receipt,
    'refresh-cw': RefreshCw,
    'search': Search,
    'settings': Settings,
    'tag': Tag,
    'file-text': FileText,
    'truck': Truck,
    'alert-circle': AlertCircle,
    'boxes': Boxes,
    'credit-card': CreditCard,
    'home': Home,
    'list-checks': ListChecks,
    'file-spreadsheet': FileSpreadsheet,
    'dollar-sign': DollarSign
  }), []);

  const IconComponent = iconMap[icon] || LayoutDashboard;
  return <IconComponent className={className} />;
});
NavIcon.displayName = 'NavIcon';

// Navigation item component props
interface NavItemProps {
  item: NavItemType;
  isMobile?: boolean;
  onClick?: () => void;
  isActive: boolean;
  role: string;
}

// Memoized navigation item component with optimized rendering
const NavItem = React.memo(function NavItem({ 
  item, 
  isMobile = false, 
  onClick,
  isActive: propIsActive,
  role
}: NavItemProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = React.useState(false);
  const href = typeof item.href === 'function' ? item.href(role) : item.href;
  
  // Only run on client-side to prevent hydration mismatch
  React.useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (!isMounted) return;
    
    router.push(href);
    if (onClick) onClick();
  }, [href, isMounted, onClick, router]);

  const linkClass = useMemo(() => 
    `group flex items-center rounded-md px-2 py-2.5 ${
      isMobile ? 'text-base' : 'text-sm'
    } font-medium ${
      propIsActive && isMounted
        ? 'bg-indigo-50 text-indigo-600' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`,
    [isMobile, propIsActive, isMounted]
  );

  const iconClass = useMemo(() => 
    `mr-3 h-5 w-5 flex-shrink-0 ${
      propIsActive && isMounted ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
    }`,
    [propIsActive, isMounted]
  );

  return (
    <a 
      href={href}
      className={linkClass}
      onClick={handleClick}
      suppressHydrationWarning
    >
      <NavIcon 
        icon={item.icon} 
        className={iconClass}
      />
      <span className="truncate">{item.name}</span>
      {propIsActive && isMounted && (
        <span className="ml-auto h-2 w-2 rounded-full bg-indigo-600" />
      )}
    </a>
  );
});
NavItem.displayName = 'NavItem';

// Navigation item type
interface NavItemType {
  name: string;
  href: string | ((role: string) => string);
  roles: string[];
  icon: string;
  exact: boolean;
}

// Navigation item component props
interface NavItemProps {
  item: NavItemType;
  isMobile?: boolean;
  onClick?: () => void;
  isActive: boolean;
  role: string;
}

function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname() || '';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Get navigation items based on user role
  const { filteredNavigation, activeItem } = useMemo(() => {
    if (!user) return { filteredNavigation: [] as NavItemType[], activeItem: null as NavItemType | null };
    
    // Get all navigation items for the user's role
    const navItems = getNavigation().filter(item => item.roles.includes(user.role));
    
    // Find the active item
    let active = null;
    let bestMatchLength = 0;
    
    for (const item of navItems) {
      const href = typeof item.href === 'function' ? item.href(user.role) : item.href;
      
      // Check for exact match first
      if (pathname === href) {
        active = item;
        break;
      }
      
      // For non-exact matches, find the most specific path match
      if (!item.exact && pathname.startsWith(href) && href.length > bestMatchLength) {
        bestMatchLength = href.length;
        active = item;
      }
    }
    
    return { 
      filteredNavigation: navItems, 
      activeItem: active
    };
  }, [user, pathname]);

  // Client-side effect
  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    router.push('/auth/login');
  }, [router, logout]);

  // Skip rendering on server to prevent hydration mismatch
  if (!isClient || !user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile menu */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between bg-indigo-600 p-4">
          <div className="flex items-center">
            <button
              type="button"
              className="text-white focus:outline-none"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <h1 className="ml-4 text-xl font-bold text-white">Furniture Showroom</h1>
          </div>
          <div className="flex items-center">
            <span className="text-white mr-4">{user.name}</span>
            <button
              onClick={handleLogout}
              className="text-white hover:text-gray-200"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile sidebar */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-40 flex">
            <div 
              className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" 
              onClick={closeMobileSidebar}
              aria-hidden="true"
            />
            <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={closeMobileSidebar}
                  aria-label="Close sidebar"
                >
                  <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </button>
              </div>
              <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
                <div className="flex flex-shrink-0 items-center px-4">
                  <h1 className="text-xl font-bold text-indigo-600">{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}</h1>
                </div>
                <nav className="mt-5 space-y-1 px-2">
                  {filteredNavigation.map((item) => (
                    <NavItem
                      key={item.name}
                      item={item}
                      role={user.role}
                      isMobile={true}
                      onClick={closeMobileSidebar}
                      isActive={activeItem?.name === item.name}
                    />
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'lg:w-64' : 'lg:w-20'
      }`}>
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex items-center justify-between px-4">
              {sidebarOpen && (
                <h1 className="text-xl font-bold text-indigo-600 whitespace-nowrap">
                  {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}
                </h1>
              )}
              <button
                onClick={toggleSidebar}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              >
                {sidebarOpen ? (
                  <ChevronLeftIcon className="h-5 w-5" />
                ) : (
                  <ChevronRightIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            <nav className="hidden lg:mt-5 lg:block">
              {filteredNavigation.map((item) => (
                <NavItem
                  key={item.name}
                  item={item}
                  role={user.role}
                  isMobile={false}
                  onClick={() => {}}
                  isActive={activeItem?.name === item.name}
                />
              ))}
            </nav>
          </div>
          <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
            <div className="group block w-full flex-shrink-0">
              <div className="flex items-center">
                <div>
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                    <span className="font-medium text-indigo-700">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                </div>
                {sidebarOpen && (
                  <div className="ml-3 overflow-hidden">
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 truncate">
                      {user?.name || 'User'}
                    </p>
                    <button
                      onClick={handleLogout}
                      className="text-xs font-medium text-gray-500 group-hover:text-gray-700"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:pl-64">
        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
