"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Users, Shield } from "lucide-react";
import { roleService, permissionService, rolePermissionService } from "@/lib/services/rbac";
import type { Role, Permission, RoleWithPermissions } from "@/lib/types/rbac";
import { useToast } from "@/hooks/use-toast";

export function RolePermissionsTab() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [rolePermissions, setRolePermissions] = useState<RoleWithPermissions | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedRole) {
      loadRolePermissions(selectedRole);
    }
  }, [selectedRole]);

  const loadData = async () => {
    try {
      const [rolesData, permissionsData] = await Promise.all([
        roleService.getAll(),
        permissionService.getAll()
      ]);
      setRoles(rolesData);
      setPermissions(permissionsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadRolePermissions = async (roleId: string) => {
    try {
      const roleWithPermissions = await roleService.getWithPermissions(roleId);
      setRolePermissions(roleWithPermissions);
      setSelectedPermissions(roleWithPermissions?.permissions.map(p => p.id) || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load role permissions",
        variant: "destructive",
      });
    }
  };

  const handlePermissionToggle = (permissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    } else {
      setSelectedPermissions(selectedPermissions.filter(id => id !== permissionId));
    }
  };

  const handleSave = async () => {
    if (!selectedRole) return;

    setSaving(true);
    try {
      await rolePermissionService.setRolePermissions(selectedRole, selectedPermissions);
      await loadRolePermissions(selectedRole);
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

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Role-Permission Management</h2>
        <p className="text-muted-foreground">Assign permissions to roles</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Select Role
          </CardTitle>
          <CardDescription>Choose a role to manage its permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a role..." />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedRole && rolePermissions && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Permissions for {rolePermissions.name}
            </CardTitle>
            <CardDescription>
              Select the permissions you want to assign to this role
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              {permissions.map((permission) => (
                <div key={permission.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                  <Checkbox
                    id={permission.id}
                    checked={selectedPermissions.includes(permission.id)}
                    onCheckedChange={(checked) => 
                      handlePermissionToggle(permission.id, checked as boolean)
                    }
                  />
                  <div className="flex-1 space-y-1">
                    <label
                      htmlFor={permission.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      <Badge variant="secondary" className="mr-2">
                        {permission.name}
                      </Badge>
                    </label>
                    {permission.description && (
                      <p className="text-sm text-muted-foreground">
                        {permission.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedRole && rolePermissions && (
        <Card>
          <CardHeader>
            <CardTitle>Current Permissions</CardTitle>
            <CardDescription>
              Permissions currently assigned to {rolePermissions.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {rolePermissions.permissions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {rolePermissions.permissions.map((permission) => (
                  <Badge key={permission.id} variant="default">
                    {permission.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No permissions assigned to this role.</p>
            )}
          </CardContent>
        </Card>
      )}

      {!selectedRole && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Select a role to manage its permissions.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}