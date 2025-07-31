// components/dashboard/roles-tab.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { roleService } from "@/lib/services/rbac";
import type { RoleWithPermissions } from "@/lib/types/rbac";
import { useToast } from "@/hooks/use-toast";

export function RolesTab({ roles: initialRoles, onDataChange }: {
  roles: RoleWithPermissions[];
  onDataChange: (data: { roles: RoleWithPermissions[] }) => void;
}) {
  const [roles, setRoles] = useState(initialRoles);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: "" });
  const { toast } = useToast();

  const loadRoles = async () => {
    try {
      const data = await roleService.getAllWithPermissions();
      setRoles(data);
      onDataChange({ roles: data });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reload roles",
        variant: "destructive",
      });
    }
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast({ title: "Error", description: "Role name cannot be empty.", variant: "destructive" });
      return;
    }
    try {
      await roleService.create(formData);
      toast({ title: "Success", description: "Role created successfully." });
      setShowCreateForm(false);
      setFormData({ name: "" });
      await loadRoles();
    } catch (error) {
      toast({ title: "Error", description: "Failed to create role.", variant: "destructive" });
    }
  };

  const handleUpdate = async (id: string) => {
    if (!formData.name.trim()) {
      toast({ title: "Error", description: "Role name cannot be empty.", variant: "destructive" });
      return;
    }
    try {
      await roleService.update(id, formData);
      toast({ title: "Success", description: "Role updated successfully." });
      setEditingId(null);
      setFormData({ name: "" });
      await loadRoles();
    } catch (error) {
      toast({ title: "Error", description: "Failed to update role.", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        await roleService.delete(id);
        toast({ title: "Success", description: "Role deleted successfully." });
        await loadRoles();
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete role.", variant: "destructive" });
      }
    }
  };

  const startEdit = (role: RoleWithPermissions) => {
    setEditingId(role.id);
    setFormData({ name: role.name });
    setShowCreateForm(false);
  };
  
  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "" });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Manage Roles</h2>
          <p className="text-muted-foreground">Create, edit, and delete user roles.</p>
        </div>
        {!showCreateForm && (
          <Button onClick={() => { setShowCreateForm(true); setEditingId(null); setFormData({ name: "" }); }}>
            <Plus className="mr-2 h-4 w-4" /> Add Role
          </Button>
        )}
      </div>

      {(showCreateForm || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Role" : "Create New Role"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role-name">Role Name</Label>
              <Input
                id="role-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Content Editor"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => (editingId ? handleUpdate(editingId) : handleCreate())}>
                <Save className="mr-2 h-4 w-4" /> Save
              </Button>
              <Button variant="outline" onClick={() => { setShowCreateForm(false); cancelEdit(); }}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="border rounded-lg">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Permissions</th>
              <th className="px-4 py-2 text-right text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {roles.map((role) => (
              <tr key={role.id}>
                <td className="px-4 py-2 font-medium">{role.name}</td>
                <td className="px-4 py-2 text-muted-foreground">
                  {role.permissions.map(p => p.name).join(', ') || "-"}
                </td>
                <td className="px-4 py-2 flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(role)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(role.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}