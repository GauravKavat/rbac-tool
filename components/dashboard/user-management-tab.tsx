// components/dashboard/user-management-tab.tsx

"use client";

import { useEffect, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { roleService } from '@/lib/services/rbac';
import type { UserWithRoles, Role } from '@/lib/types/rbac';
import { Button } from '@/components/ui/button';
import { EditUserRolesModal } from './edit-user-roles-modal';
import { Badge } from '@/components/ui/badge';
import { Edit } from 'lucide-react';

export function UserManagementTab() {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/users-with-roles');
      if (!res.ok) throw new Error('Failed to fetch user data');
      const { users, roles } = await res.json();
      setUsers(users || []);
      setAllRoles(roles);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch user data.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">User Management</h2>
        <p className="text-muted-foreground">View users and manage their assigned roles.</p>
      </div>
      <div className="border rounded-lg">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">Email</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Roles</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Joined</th>
              <th className="px-4 py-2 text-right text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-2 font-medium">{user.email}</td>
                <td className="px-4 py-2">
                  <div className="flex flex-wrap gap-1">
                    {user.roles.length > 0 ? (
                      user.roles.map(role => <Badge key={role.id} variant="secondary">{role.name}</Badge>)
                    ) : (
                      <span className="text-xs text-muted-foreground">No roles</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2 text-muted-foreground">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-2 text-right">
                  <Button variant="ghost" size="icon" onClick={() => setSelectedUser(user)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <EditUserRolesModal
          user={selectedUser}
          allRoles={allRoles}
          onClose={() => setSelectedUser(null)}
          onRolesChanged={fetchData}
        />
      )}
    </div>
  );
}