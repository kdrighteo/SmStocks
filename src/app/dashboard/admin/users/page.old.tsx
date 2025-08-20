'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  Card, 
  Title, 
  Text, 
  Button, 
  Table, 
  TableHead, 
  TableRow, 
  TableHeaderCell, 
  TableBody, 
  TableCell, 
  Badge, 
  TextInput,
  Select,
  SelectItem
} from '@tremor/react';
import { 
  Search, 
  User, 
  UserPlus, 
  Shield, 
  UserCog, 
  CheckCircle, 
  XCircle, 
  ChevronDown, 
  ChevronUp,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Filter,
  Download,
  RefreshCw,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Pencil
} from 'lucide-react';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'cashier' | 'manager';
  status: 'active' | 'inactive' | 'suspended';
  lastActive: string;
  joinDate: string;
  avatar?: string;
};

type SortDirection = 'asc' | 'desc';

type SortConfig = {
  key: keyof User | '';
  direction: SortDirection;
};

export default function UsersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/auth/login');
      return;
    }
    
    // Simulate API call
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        // Mock data
        const mockUsers: User[] = [
          { 
            id: '1', 
            name: 'Admin User', 
            email: 'admin@example.com', 
            role: 'admin', 
            status: 'active',
            lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            joinDate: '2022-01-15',
            avatar: '/avatars/admin.jpg'
          },
          { 
            id: '2', 
            name: 'Manager One', 
            email: 'manager@example.com', 
            role: 'manager', 
            status: 'active',
            lastActive: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            joinDate: '2022-03-10',
            avatar: '/avatars/manager.jpg'
          },
          { 
            id: '3', 
            name: 'Cashier One', 
            email: 'cashier1@example.com', 
            role: 'cashier', 
            status: 'active',
            lastActive: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
            joinDate: '2023-01-20',
            avatar: '/avatars/cashier1.jpg'
          },
          { 
            id: '4', 
            name: 'Cashier Two', 
            email: 'cashier2@example.com', 
            role: 'cashier', 
            status: 'inactive',
            lastActive: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            joinDate: '2023-02-15',
            avatar: '/avatars/cashier2.jpg'
          },
          { 
            id: '5', 
            name: 'Suspended User', 
            email: 'suspended@example.com', 
            role: 'cashier', 
            status: 'suspended',
            lastActive: new Date('2023-04-01T11:10:00Z').toISOString(),
            joinDate: '2023-01-05',
            avatar: '/avatars/suspended.jpg'
          },
        ];
        
        setUsers(mockUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [user, router]);

  const getStatusBadge = (status: User['status']) => {
    const statusConfig = {
      active: { color: 'emerald', icon: CheckCircle },
      inactive: { color: 'yellow', icon: Clock },
      suspended: { color: 'red', icon: XCircle }
    };
    
    const { color, icon: StatusIcon } = statusConfig[status] || { color: 'gray', icon: Clock };
    
    return (
      <Badge color={color} className="flex items-center gap-1.5">
        <StatusIcon className="h-3.5 w-3.5" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getRoleBadge = (role: User['role']) => {
    const roleConfig = {
      admin: { color: 'violet', icon: Shield },
      manager: { color: 'blue', icon: UserCog },
      cashier: { color: 'indigo', icon: User }
    };
    
    const { color, icon: RoleIcon } = roleConfig[role] || { color: 'gray', icon: User };
    
    return (
      <Badge color={color} className="flex items-center gap-1.5">
        <RoleIcon className="h-3.5 w-3.5" />
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  const formatLastActive = (dateString: string) => {
    const now = new Date();
    const lastActive = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleSort = (key: keyof User) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedUsers = (): User[] => {
    const sortableUsers = [...users];
    if (sortConfig.key) {
      sortableUsers.sort((a, b) => {
        // Safely access the sort field with type checking
        const getSortValue = (user: User, field: keyof User) => {
          const value = user[field];
          return typeof value === 'string' ? value.toLowerCase() : String(value);
        };
        
        const aValue = getSortValue(a, sortConfig.key as keyof User);
        const bValue = getSortValue(b, sortConfig.key as keyof User);
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableUsers;
  };

  const getSortIcon = (key: keyof User) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="h-4 w-4 ml-1 inline" /> : 
      <ChevronDown className="h-4 w-4 ml-1 inline" />;
  };

  const toggleSelectUser = (id: string) => {
    setSelectedUsers((prev: string[]) => 
      prev.includes(id) 
        ? prev.filter((userId: string) => userId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const sortedUsers = getSortedUsers();
    if (selectedUsers.length === sortedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(sortedUsers.map((user: User) => user.id));
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/admin/users/edit/${id}`);
  };

  const handleView = (id: string) => {
    router.push(`/dashboard/admin/users/${id}`);
  };

  const handleDelete = (id?: string) => {
    const idsToDelete = id ? [id] : selectedUsers;
    if (idsToDelete.length === 0) return;
    
    if (confirm(`Are you sure you want to delete ${idsToDelete.length === 1 ? 'this user' : 'these users'}?`)) {
      // In a real app, this would be an API call
      console.log('Deleting users:', idsToDelete);
      setUsers(users.filter(user => !idsToDelete.includes(user.id)));
      setSelectedUsers(selectedUsers.filter(userId => !idsToDelete.includes(userId)));
      alert(`${idsToDelete.length} user(s) deleted successfully`);
    }
  };

  const handleStatusChange = (id: string, status: User['status']) => {
    // In a real app, this would be an API call
    setUsers(users.map(user => 
      user.id === id ? { ...user, status } : user
    ));
  };

  const filteredUsers = getSortedUsers();
  const activeUsers = users.filter((u: User) => u.status === 'active').length;
  const inactiveUsers = users.filter((u: User) => u.status !== 'active').length;
  const adminUsers = users.filter((u: User) => u.role === 'admin').length;
  const cashierUsers = users.filter((u: User) => u.role === 'cashier').length;
  const managerUsers = users.filter((u: User) => u.role === 'manager').length;

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500">Manage user accounts and permissions</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button 
            variant="secondary" 
            icon={RefreshCw}
            onClick={() => window.location.reload()}
            disabled={isLoading}
          >
            Refresh
          </Button>
          <Button 
            icon={UserPlus}
            onClick={() => router.push('/dashboard/admin/users/new')}
          >
            Add User
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="border-l-4 border-indigo-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-50 text-indigo-600">
              <User className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-semibold">{users.length}</p>
            </div>
          </div>
        </Card>
        <Card className="border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-50 text-green-600">
              <UserCheck className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active</p>
              <p className="text-2xl font-semibold">{activeUsers}</p>
            </div>
          </div>
        </Card>
        <Card className="border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-50 text-yellow-600">
              <UserX className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Inactive</p>
              <p className="text-2xl font-semibold">{inactiveUsers}</p>
            </div>
          </div>
        </Card>
        <Card className="border-l-4 border-violet-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-violet-50 text-violet-600">
              <Shield className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Admins</p>
              <p className="text-2xl font-semibold">{adminUsers}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mb-6 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <TextInput
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <div className="flex space-x-2">
            <Select 
              value={roleFilter}
              onValueChange={setRoleFilter}
              className="w-40"
              icon={UserCog}
            >
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="cashier">Cashier</SelectItem>
            </Select>
            <Select 
              value={statusFilter}
              onValueChange={setStatusFilter}
              className="w-40"
              icon={Filter}
            >
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </Select>
            <Button variant="light" icon={Download}>
              Export
            </Button>
          </div>
        </div>

        {selectedUsers.length > 0 && (
          <div className="bg-indigo-50 p-3 rounded-lg mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-indigo-600 mr-2" />
              <span className="text-sm font-medium text-indigo-700">
                {selectedUsers.length} {selectedUsers.length === 1 ? 'user' : 'users'} selected
              </span>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="light" 
                color="red"
                size="xs"
                onClick={() => handleDelete()}
              >
                Delete Selected
              </Button>
              <Button 
                variant="light" 
                size="xs"
                onClick={() => setSelectedUsers([])}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </TableHeaderCell>
                <TableHeaderCell 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('name')}
                >
                  User {getSortIcon('name')}
                </TableHeaderCell>
                <TableHeaderCell>Role</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('lastActive')}
                >
                  Last Active {getSortIcon('lastActive')}
                </TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleSelectUser(user.id)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">{formatLastActive(user.lastActive)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(user.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                          aria-label="Edit user"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-900"
                          aria-label="Delete user"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-gray-500">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
