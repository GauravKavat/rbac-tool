'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default function RolesClient({ roles: initialRoles, permissions, rolePermissions: initialRolePermissions }) {
  const [roles, setRoles] = useState(initialRoles);
  const [rolePermissions, setRolePermissions] = useState(initialRolePermissions);
  const [newRoleName, setNewRoleName] = useState('');
  const [editingRole, setEditingRole] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState(new Set());

  const supabase = createClient();

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return;

    const { data, error } = await supabase.from('roles').insert([{ name: newRoleName.trim() }]).select();

    if (error) {
      console.error('Error creating role:', error);
    } else if (data) {
      setRoles([...roles, data[0]]);
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
      setRoles(roles.map(role => (role.id === editingRole.id ? data[0] : role)));
      setEditingRole(null);
      setNewRoleName('');
    }
  };

  const handleDeleteRole = async (roleId) => {
    const { error } = await supabase.from('roles').delete().eq('id', roleId);
    if (error) {
      console.error('Error deleting role:', error);
    } else {
      setRoles(roles.filter(role => role.id !== roleId));
    }
  };
  
  const handlePermissionChange = async (permissionId, isChecked) => {
    if (!editingRole) return;
  
    if (isChecked) {
      const { error } = await supabase.from('role_permissions').insert([{ role_id: editingRole.id, permission_id: permissionId }]);
      if (error) console.error('Error adding permission to role:', error);
      else setRolePermissions([...rolePermissions, { role_id: editingRole.id, permission_id: permissionId }]);
    } else {
      const { error } = await supabase.from('role_permissions').delete().match({ role_id: editingRole.id, permission_id: permissionId });
      if (error) console.error('Error removing permission from role:', error);
      else setRolePermissions(rolePermissions.filter(rp => !(rp.role_id === editingRole.id && rp.permission_id === permissionId)));
    }
  };
  
  const startEditing = (role) => {
    setEditingRole(role);
    setNewRoleName(role.name);
    const currentPermissions = new Set(
      rolePermissions
        .filter(rp => rp.role_id === role.id)
        .map(rp => rp.permission_id)
    );
    setSelectedPermissions(currentPermissions);
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
        {roles.map((role) => (
          <Card key={role.id}>
            <CardHeader>
              <CardTitle>{role.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h3 className="font-semibold">Permissions:</h3>
                {permissions.map(permission => {
                  const hasPermission = rolePermissions.some(
                    rp => rp.role_id === role.id && rp.permission_id === permission.id
                  );
                  return (
                    <div key={permission.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`${role.id}-${permission.id}`}
                        checked={hasPermission}
                        onCheckedChange={(checked) => handlePermissionChange(permission.id, checked)}
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