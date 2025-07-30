"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { permissionService } from "@/lib/services/rbac";
import type { Permission } from "@/lib/types/rbac";
import { useToast } from "@/hooks/use-toast";

export function PermissionsTab() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const { toast } = useToast();

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      const data = await permissionService.getAll();
      setPermissions(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load permissions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Permission name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      await permissionService.create(formData);
      setFormData({ name: "", description: "" });
      setShowCreateForm(false);
      loadPermissions();
      toast({
        title: "Success",
        description: "Permission created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create permission",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (id: string) => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Permission name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      await permissionService.update(id, formData);
      setEditingId(null);
      setFormData({ name: "", description: "" });
      loadPermissions();
      toast({
        title: "Success",
        description: "Permission updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update permission",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this permission?")) return;

    try {
      await permissionService.delete(id);
      loadPermissions();
      toast({
        title: "Success",
        description: "Permission deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete permission",
        variant: "destructive",
      });
    }
  };

  const startEdit = (permission: Permission) => {
    setEditingId(permission.id);
    setFormData({ name: permission.name, description: permission.description || "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", description: "" });
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading permissions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Permissions</h2>
          <p className="text-muted-foreground">Manage individual permissions in your system</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} disabled={showCreateForm}>
          <Plus className="h-4 w-4 mr-2" />
          Add Permission
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Permission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., can_edit_articles"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of what this permission allows"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate}>
                <Save className="h-4 w-4 mr-2" />
                Create
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {permissions.map((permission) => (
          <Card key={permission.id}>
            <CardContent className="p-6">
              {editingId === permission.id ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`edit-name-${permission.id}`}>Name</Label>
                    <Input
                      id={`edit-name-${permission.id}`}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`edit-description-${permission.id}`}>Description</Label>
                    <Textarea
                      id={`edit-description-${permission.id}`}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleUpdate(permission.id)}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={cancelEdit}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{permission.name}</Badge>
                    </div>
                    {permission.description && (
                      <p className="text-sm text-muted-foreground">{permission.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Created: {new Date(permission.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => startEdit(permission)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(permission.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {permissions.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No permissions found. Create your first permission to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}