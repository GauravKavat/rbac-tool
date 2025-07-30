"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { roleService } from "@/lib/services/rbac";
import type { Role } from "@/lib/types/rbac";
import { useToast } from "@/hooks/use-toast";

export function RolesTab({ roles, onDataChange }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: "" });
  const { toast } = useToast();

  const loadRoles = async () => {
    try {
      const data = await roleService.getAllWithPermissions();
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
    // ... (rest of the code is the same)
  };

  const handleUpdate = async (id: string) => {
    // ... (rest of the code is the same)
  };

  const handleDelete = async (id: string) => {
    // ... (rest of the code is the same)
  };

  const startEdit = (role: Role) => {
    setEditingId(role.id);
    setFormData({ name: role.name });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "" });
  };
  
  return (
    <div className="space-y-6">
      {/* ... (rest of the JSX is the same, just remove the loading state and use the `roles` prop) */}
    </div>
  );
}