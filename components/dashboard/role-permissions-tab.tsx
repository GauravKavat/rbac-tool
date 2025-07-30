"use client";

import { useState, useEffect } from "react";
// ... (imports are the same)
import { roleService, rolePermissionService } from "@/lib/services/rbac";
// ... (imports are the same)

export function RolePermissionsTab({ roles, permissions, onDataChange }) {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedRole) {
      const role = roles.find(r => r.id === selectedRole);
      setSelectedPermissions(role?.permissions.map(p => p.id) || []);
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
  const rolePermissions = roles.find(r => r.id === selectedRole);

  return (
    <div className="space-y-6">
      {/* ... (rest of the JSX is the same, but remove loading state and use props) */}
    </div>
  );
}