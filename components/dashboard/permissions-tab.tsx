"use client";

import { useState } from "react";
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

export function PermissionsTab({ permissions, onDataChange }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const { toast } = useToast();

  const loadPermissions = async () => {
    try {
      const data = await permissionService.getAll();
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
    // ... (rest of the code is the same)
  };

  const handleUpdate = async (id: string) => {
    // ... (rest of the code is the same)
  };

  const handleDelete = async (id: string) => {
    // ... (rest of the code is the same)
  };

  const startEdit = (permission: Permission) => {
    setEditingId(permission.id);
    setFormData({ name: permission.name, description: permission.description || "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", description: "" });
  };

  return (
    <div className="space-y-6">
      {/* ... (rest of the JSX is the same, just remove the loading state) */}
    </div>
  );
}