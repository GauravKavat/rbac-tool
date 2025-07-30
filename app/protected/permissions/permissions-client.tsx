'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PermissionsClient({ permissions: initialPermissions }) {
  const [permissions, setPermissions] = useState(initialPermissions);
  const [newPermissionName, setNewPermissionName] = useState('');
  const [newPermissionDescription, setNewPermissionDescription] = useState('');
  const [editingPermission, setEditingPermission] = useState(null);

  const supabase = createClient();

  const handleCreatePermission = async () => {
    if (!newPermissionName.trim()) return;

    const { data, error } = await supabase
      .from('permissions')
      .insert([{ name: newPermissionName.trim(), description: newPermissionDescription.trim() }])
      .select();

    if (error) {
      console.error('Error creating permission:', error);
    } else if (data) {
      setPermissions([...permissions, data[0]]);
      setNewPermissionName('');
      setNewPermissionDescription('');
    }
  };

  const handleUpdatePermission = async () => {
    if (!editingPermission || !newPermissionName.trim()) return;

    const { data, error } = await supabase
      .from('permissions')
      .update({ name: newPermissionName.trim(), description: newPermissionDescription.trim() })
      .eq('id', editingPermission.id)
      .select();

    if (error) {
      console.error('Error updating permission:', error);
    } else if (data) {
      setPermissions(permissions.map(p => (p.id === editingPermission.id ? data[0] : p)));
      setEditingPermission(null);
      setNewPermissionName('');
      setNewPermissionDescription('');
    }
  };

  const handleDeletePermission = async (permissionId) => {
    const { error } = await supabase.from('permissions').delete().eq('id', permissionId);
    if (error) {
      console.error('Error deleting permission:', error);
    } else {
      setPermissions(permissions.filter(p => p.id !== permissionId));
    }
  };

  const startEditing = (permission) => {
    setEditingPermission(permission);
    setNewPermissionName(permission.name);
    setNewPermissionDescription(permission.description || '');
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{editingPermission ? 'Edit Permission' : 'Create a New Permission'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input
            placeholder="Permission name (e.g., 'edit:post')"
            value={newPermissionName}
            onChange={(e) => setNewPermissionName(e.target.value)}
          />
          <Input
            placeholder="Description"
            value={newPermissionDescription}
            onChange={(e) => setNewPermissionDescription(e.target.value)}
          />
          {editingPermission ? (
            <div className="flex gap-2">
              <Button onClick={handleUpdatePermission}>Update Permission</Button>
              <Button variant="outline" onClick={() => { setEditingPermission(null); setNewPermissionName(''); setNewPermissionDescription(''); }}>Cancel</Button>
            </div>
          ) : (
            <Button onClick={handleCreatePermission}>Create Permission</Button>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {permissions.map((permission) => (
          <Card key={permission.id}>
            <CardHeader>
              <CardTitle>{permission.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{permission.description || 'No description'}</p>
              <div className="mt-4 flex gap-2">
                <Button onClick={() => startEditing(permission)}>Edit</Button>
                <Button variant="destructive" onClick={() => handleDeletePermission(permission.id)}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}