// components/dashboard/permissions-tab.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { permissionService } from "@/lib/services/rbac";
import type { Permission } from "@/lib/types/rbac";
import { useToast } from "@/hooks/use-toast";

export function PermissionsTab({ permissions: initialPermissions, onDataChange }: { 
  permissions: Permission[]; 
  onDataChange: (data: { permissions: Permission[] }) => void;
}) {
  const [permissions, setPermissions] = useState(initialPermissions);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const { toast } = useToast();

  const loadPermissions = async () => {
    try {
      const data = await permissionService.getAll();
      setPermissions(data);
      onDataChange({ permissions: data });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reload permissions",
        variant: "destructive",
      });
    }
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast({ title: "Error", description: "Permission name cannot be empty.", variant: "destructive" });
      return;
    }
    try {
      await permissionService.create(formData);
      toast({ title: "Success", description: "Permission created successfully." });
      setShowCreateForm(false);
      setFormData({ name: "", description: "" });
      await loadPermissions();
    } catch (error) {
      toast({ title: "Error", description: "Failed to create permission.", variant: "destructive" });
    }
  };

  const handleUpdate = async (id: string) => {
    if (!formData.name.trim()) {
      toast({ title: "Error", description: "Permission name cannot be empty.", variant: "destructive" });
      return;
    }
    try {
      await permissionService.update(id, formData);
      toast({ title: "Success", description: "Permission updated successfully." });
      setEditingId(null);
      setFormData({ name: "", description: "" });
      await loadPermissions();
    } catch (error) {
      toast({ title: "Error", description: "Failed to update permission.", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this permission?")) {
      try {
        await permissionService.delete(id);
        toast({ title: "Success", description: "Permission deleted successfully." });
        await loadPermissions();
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete permission.", variant: "destructive" });
      }
    }
  };

  const startEdit = (permission: Permission) => {
    setEditingId(permission.id);
    setFormData({ name: permission.name, description: permission.description || "" });
    setShowCreateForm(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", description: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Manage Permissions</h2>
          <p className="text-muted-foreground">Create, edit, and delete permissions.</p>
        </div>
        {!showCreateForm && (
          <Button onClick={() => { setShowCreateForm(true); setEditingId(null); setFormData({ name: "", description: "" }); }}>
            <Plus className="mr-2 h-4 w-4" /> Add Permission
          </Button>
        )}
      </div>

      {(showCreateForm || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Permission" : "Create New Permission"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="perm-name">Permission Name</Label>
              <Input
                id="perm-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., can_edit_articles"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="perm-desc">Description</Label>
              <Textarea
                id="perm-desc"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="A short description of what this permission allows."
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
              <th className="px-4 py-2 text-left text-sm font-semibold">Description</th>
              <th className="px-4 py-2 text-right text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {permissions.map((permission) => (
              <tr key={permission.id}>
                <td className="px-4 py-2 font-medium">{permission.name}</td>
                <td className="px-4 py-2 text-muted-foreground">{permission.description || "-"}</td>
                <td className="px-4 py-2 flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(permission)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(permission.id)}>
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