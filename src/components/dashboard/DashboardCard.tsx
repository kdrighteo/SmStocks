import Link from 'next/link';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  href: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export function DashboardCard({ 
  title, 
  value, 
  icon, 
  href, 
  trend, 
  className = '' 
}: DashboardCardProps) {
  return (
    <Link 
      href={href}
      className={`block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {value}
          </p>
          {trend && (
            <div className={`mt-1 flex items-center text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? (
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 01.707.293l4 4a1 1 0 01-1.414 1.414L12 9.414 8.707 12.707a1 1 0 01-1.414-1.414l4-4A1 1 0 0112 7z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 13a1 1 0 01-.707-.293l-4-4a1 1 0 011.414-1.414L12 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4A1 1 0 0112 13z" clipRule="evenodd" />
                </svg>
              )}
              <span className="ml-1">{trend.value}</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600">
          {icon}
        </div>
      </div>
    </Link>
  );
}
