'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Title } from '@/components/ui/title'
import { Text } from '@/components/ui/text'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Image from 'next/image';
import { Search, User, UserPlus, Shield, CheckCircle, XCircle, Pencil, Trash2 } from 'lucide-react';

type UserRole = 'admin' | 'manager' | 'cashier' | 'staff';
type UserStatus = 'active' | 'inactive' | 'suspended';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastActive: string;
  joinDate: string;
  avatar?: string;
}

const mockUsers: User[] = [
  {
    id: 'USR-001',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    role: 'admin',
    status: 'active',
    lastActive: '2023-08-15T14:30:00Z',
    joinDate: '2022-01-15',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: 'USR-002',
    name: 'Maria Garcia',
    email: 'maria.garcia@example.com',
    role: 'manager',
    status: 'active',
    lastActive: '2023-08-14T09:15:00Z',
    joinDate: '2022-03-22',
    avatar: 'https://i.pravatar.cc/150?img=2'
  },
  {
    id: 'USR-003',
    name: 'James Wilson',
    email: 'james.wilson@example.com',
    role: 'cashier',
    status: 'active',
    lastActive: '2023-08-15T10:45:00Z',
    joinDate: '2022-05-10',
    avatar: 'https://i.pravatar.cc/150?img=3'
  },
  {
    id: 'USR-004',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    role: 'staff',
    status: 'inactive',
    lastActive: '2023-07-30T16:20:00Z',
    joinDate: '2022-08-05',
    avatar: 'https://i.pravatar.cc/150?img=4'
  },
  {
    id: 'USR-005',
    name: 'David Kim',
    email: 'david.kim@example.com',
    role: 'staff',
    status: 'suspended',
    lastActive: '2023-06-20T11:10:00Z',
    joinDate: '2023-01-15',
    avatar: 'https://i.pravatar.cc/150?img=5'
  },
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [users] = useState<User[]>(mockUsers);

  // Filter users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge
  const getStatusBadge = (status: UserStatus) => {
    const statusConfig = {
      active: { color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle },
      inactive: { color: 'bg-gray-100 text-gray-800', icon: XCircle },
      suspended: { color: 'bg-red-100 text-red-800', icon: Trash2 },
    };
    
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', icon: XCircle };
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Get role badge
  const getRoleBadge = (role: UserRole) => {
    const roleConfig = {
      admin: { color: 'bg-purple-100 text-purple-800', icon: Shield },
      manager: { color: 'bg-blue-100 text-blue-800', icon: User },
      cashier: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      staff: { color: 'bg-gray-100 text-gray-800', icon: User },
    };
    
    const config = roleConfig[role] || { color: 'bg-gray-100 text-gray-800', icon: User };
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-gray-600">Manage your team members and their permissions</p>
        </div>
        <Button 
          icon={UserPlus} 
          className="mt-4 md:mt-0 w-full md:w-auto"
          onClick={() => {}}
        >
          Add User
        </Button>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Text>Search</Text>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <Text>Role</Text>
            <Select
              value={roleFilter}
              onValueChange={setRoleFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="cashier">Cashier</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-48">
            <Text>Status</Text>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeader>User</TableHeader>
                <TableHeader>Role</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Last Active</TableHeader>
                <TableHeader>Joined</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full overflow-hidden mr-3 bg-gray-200 flex items-center justify-center">
                        {user.avatar ? (
                          <Image 
                            src={user.avatar}
                            alt={user.name}
                            width={40}
                            height={40}
                            className="object-cover h-full w-full"
                          />
                        ) : (
                          <User className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getRoleBadge(user.role)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(user.status)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{formatDate(user.lastActive)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{formatDate(user.joinDate)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        icon={Pencil} 
                        size="xs" 
                        variant="light"
                        onClick={() => {}}
                      />
                      <Button 
                        icon={Trash2} 
                        size="xs" 
                        variant="light" 
                        color="red"
                        onClick={() => {}}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
