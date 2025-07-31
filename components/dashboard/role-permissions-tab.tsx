"use client";

import { useState, useEffect } from "react";

import { roleService, rolePermissionService } from "@/lib/services/rbac";
import { useToast } from "@/hooks/use-toast";
import type { RoleWithPermissions, Permission } from "@/lib/types/rbac";


interface RolePermissionsTabProps {
  roles: RoleWithPermissions[];
  permissions: Permission[];
  onDataChange: (data: { roles?: RoleWithPermissions[]; permissions?: Permission[] }) => void;
}

export function RolePermissionsTab({ roles, permissions, onDataChange }: RolePermissionsTabProps) {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const { toast } = useToast();
  // Create or update role
  const handleCreateOrUpdateRole = async () => {
    if (!newRoleName.trim()) return;
    try {
      if (editingRoleId) {
        await roleService.update(editingRoleId, { name: newRoleName.trim() });
        toast({ title: "Role updated", description: `Role name updated to '${newRoleName.trim()}'` });
      } else {
        await roleService.create({ name: newRoleName.trim() });
        toast({ title: "Role created", description: `Role '${newRoleName.trim()}' created` });
      }
      setNewRoleName("");
      setEditingRoleId(null);
      await loadRoles();
    } catch (error) {
      toast({ title: "Error", description: "Failed to save role", variant: "destructive" });
    }
  };

  // Delete role
  const handleDeleteRole = async (roleId: string) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;
    try {
      await roleService.delete(roleId);
      toast({ title: "Role deleted", description: "Role has been deleted" });
      if (selectedRole === roleId) setSelectedRole("");
      await loadRoles();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete role", variant: "destructive" });
    }
  };

  useEffect(() => {
    if (selectedRole) {
      const role = roles.find((r: RoleWithPermissions) => r.id === selectedRole);
      setSelectedPermissions(role?.permissions.map((p: Permission) => p.id) || []);
    }
  }, [selectedRole, roles]);

  const loadRoles = async () => {
    try {
      const rolesData = await roleService.getAllWithPermissions();
      onDataChange({ roles: rolesData });
    } catch (error) {
      // ...
    }
  };

  const handleSave = async () => {
    if (!selectedRole) return;

    setSaving(true);
    try {
      await rolePermissionService.setRolePermissions(selectedRole, selectedPermissions);
      await loadRoles();
      toast({
        title: "Success",
        description: "Role permissions updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update role permissions",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  // ... (rest of the functions are similar)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Select a Role</h2>
        <select
          className="w-full p-2 border rounded mb-4 bg-background text-foreground"
          value={selectedRole}
          onChange={e => setSelectedRole(e.target.value)}
        >
          <option value="" disabled>Select a role...</option>
          {roles.map(role => (
            <option key={role.id} value={role.id}>{role.name}</option>
          ))}
        </select>
      </div>

      {selectedRole && (
        <div>
          <h3 className="font-semibold mb-2">Assign Permissions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {permissions.map(permission => (
              <label key={permission.id} className="flex items-center gap-2 p-2 border rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedPermissions.includes(permission.id)}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedPermissions([...selectedPermissions, permission.id]);
                    } else {
                      setSelectedPermissions(selectedPermissions.filter(id => id !== permission.id));
                    }
                  }}
                  disabled={saving}
                />
                <span>{permission.name}</span>
                {permission.description && (
                  <span className="text-xs text-muted-foreground ml-2">({permission.description})</span>
                )}
              </label>
            ))}
          </div>
          <button
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-50"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Permissions'}
          </button>
        </div>
      )}
      {/* Role Management Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Manage Roles</h2>
        <div className="flex gap-2 mb-4">
          <input
            className="p-2 border rounded w-64"
            placeholder="Role name"
            value={newRoleName}
            onChange={e => setNewRoleName(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-50"
            onClick={handleCreateOrUpdateRole}
            disabled={saving || !newRoleName.trim()}
          >
            {editingRoleId ? "Update Role" : "Add Role"}
          </button>
          {editingRoleId && (
            <button
              className="px-4 py-2 bg-muted text-foreground rounded"
              onClick={() => { setEditingRoleId(null); setNewRoleName(""); }}
            >
              Cancel
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-muted">
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Permissions</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map(role => (
                <tr key={role.id} className="hover:bg-accent">
                  <td className="p-2 border font-medium">{role.name}</td>
                  <td className="p-2 border">
                    {role.permissions.length > 0
                      ? role.permissions.map(p => p.name).join(", ")
                      : <span className="text-muted-foreground">No permissions</span>}
                  </td>
                  <td className="p-2 border flex gap-2">
                    <button
                      className="px-2 py-1 bg-secondary text-foreground rounded"
                      onClick={() => {
                        setSelectedRole(role.id);
                        setEditingRoleId(role.id);
                        setNewRoleName(role.name);
                      }}
                    >Edit</button>
                    <button
                      className="px-2 py-1 bg-destructive text-destructive-foreground rounded"
                      onClick={() => handleDeleteRole(role.id)}
                    >Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Existing UI for assigning permissions to a role */}
      <div>
        <h2 className="text-xl font-bold mb-2">Select a Role</h2>
        <select
          className="w-full p-2 border rounded mb-4 bg-background text-foreground"
          value={selectedRole}
          onChange={e => setSelectedRole(e.target.value)}
        >
          <option value="" disabled>Select a role...</option>
          {roles.map(role => (
            <option key={role.id} value={role.id}>{role.name}</option>
          ))}
        </select>
      </div>

      {selectedRole && (
        <div>
          <h3 className="font-semibold mb-2">Assign Permissions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {permissions.map(permission => (
              <label key={permission.id} className="flex items-center gap-2 p-2 border rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedPermissions.includes(permission.id)}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedPermissions([...selectedPermissions, permission.id]);
                    } else {
                      setSelectedPermissions(selectedPermissions.filter(id => id !== permission.id));
                    }
                  }}
                  disabled={saving}
                />
                <span>{permission.name}</span>
                {permission.description && (
                  <span className="text-xs text-muted-foreground ml-2">({permission.description})</span>
                )}
              </label>
            ))}
          </div>
          <button
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-50"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Permissions'}
          </button>
        </div>
      )}
    </div>
  );
}