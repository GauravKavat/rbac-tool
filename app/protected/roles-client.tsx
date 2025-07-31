'use client';


import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { Role, Permission, RolePermission } from '@/lib/types/rbac';


interface RolesClientProps {
  roles: Role[];
  permissions: Permission[];
  rolePermissions: RolePermission[];
}

export default function RolesClient({ roles: initialRoles, permissions, rolePermissions: initialRolePermissions }: RolesClientProps) {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>(initialRolePermissions);
  const [newRoleName, setNewRoleName] = useState<string>('');
  const [editingRole, setEditingRole] = useState<Role | null>(null);


  const supabase = createClient();

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return;

    const { data, error } = await supabase.from('roles').insert([{ name: newRoleName.trim() }]).select();

    if (error) {
      console.error('Error creating role:', error);
    } else if (data) {
      setRoles([...roles, data[0] as Role]);
      setNewRoleName('');
    }
  };
  
  const handleUpdateRole = async () => {
    if (!editingRole || !newRoleName.trim()) return;

    const { data, error } = await supabase
      .from('roles')
      .update({ name: newRoleName.trim() })
      .eq('id', editingRole.id)
      .select();

    if (error) {
      console.error('Error updating role:', error);
    } else if (data) {
      setRoles(roles.map((role: Role) => (role.id === editingRole.id ? data[0] as Role : role)));
      setEditingRole(null);
      setNewRoleName('');
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    const { error } = await supabase.from('roles').delete().eq('id', roleId);
    if (error) {
      console.error('Error deleting role:', error);
    } else {
      setRoles(roles.filter((role: Role) => role.id !== roleId));
    }
  };
  
  const handlePermissionChange = async (permissionId: string, isChecked: boolean) => {
    if (!editingRole) return;

    if (isChecked) {
      const { error } = await supabase.from('role_permissions').insert([{ role_id: editingRole.id, permission_id: permissionId }]);
      if (error) console.error('Error adding permission to role:', error);
      else setRolePermissions([...rolePermissions, { role_id: editingRole.id, permission_id: permissionId } as RolePermission]);
    } else {
      const { error } = await supabase.from('role_permissions').delete().match({ role_id: editingRole.id, permission_id: permissionId });
      if (error) console.error('Error removing permission from role:', error);
      else setRolePermissions(rolePermissions.filter((rp: RolePermission) => !(rp.role_id === editingRole.id && rp.permission_id === permissionId)));
    }
  };
  
  const startEditing = (role: Role) => {
    setEditingRole(role);
    setNewRoleName(role.name);
    // If you want to use currentPermissions, handle it here, otherwise removed as unused.
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{editingRole ? 'Edit Role' : 'Create a New Role'}</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input
            placeholder="New role name"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
          />
          {editingRole ? (
            <>
              <Button onClick={handleUpdateRole}>Update Role</Button>
              <Button variant="outline" onClick={() => { setEditingRole(null); setNewRoleName(''); }}>Cancel</Button>
            </>
          ) : (
            <Button onClick={handleCreateRole}>Create Role</Button>
          )}
        </CardContent>
      </Card>
  
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role: Role) => (
          <Card key={role.id}>
            <CardHeader>
              <CardTitle>{role.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h3 className="font-semibold">Permissions:</h3>
                {permissions.map((permission: Permission) => {
                  const hasPermission = rolePermissions.some((rp: RolePermission) =>
                    rp.role_id === role.id && rp.permission_id === permission.id
                  );
                  return (
                    <div key={permission.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`${role.id}-${permission.id}`}
                        checked={hasPermission}
                        onCheckedChange={(checked: boolean) => handlePermissionChange(permission.id, checked)}
                        disabled={!editingRole || editingRole.id !== role.id}
                      />
                      <Label htmlFor={`${role.id}-${permission.id}`}>{permission.name}</Label>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex gap-2">
                <Button onClick={() => startEditing(role)}>Edit</Button>
                <Button variant="destructive" onClick={() => handleDeleteRole(role.id)}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}