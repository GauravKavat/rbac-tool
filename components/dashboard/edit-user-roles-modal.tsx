// components/dashboard/edit-user-roles-modal.tsx

"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import type { Role, UserWithRoles } from '@/lib/types/rbac';
import { useToast } from '@/hooks/use-toast';
import { roleService } from '@/lib/services/rbac';
// adminService would be needed for updates, but we'll simulate for now.

interface EditUserRolesModalProps {
  user: UserWithRoles;
  allRoles: Role[];
  onClose: () => void;
  onRolesChanged: () => void; // To trigger a refresh
}

export function EditUserRolesModal({ user, allRoles, onClose, onRolesChanged }: EditUserRolesModalProps) {
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>(() => user.roles.map(r => r.id));
  const [newRoleName, setNewRoleName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleRoleToggle = (roleId: string) => {
    setSelectedRoleIds(prev =>
      prev.includes(roleId) ? prev.filter(id => id !== roleId) : [...prev, roleId]
    );
  };

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return;
    try {
      await roleService.create({ name: newRoleName.trim() });
      toast({ title: "Success", description: "New role created." });
      setNewRoleName('');
      onRolesChanged(); // Refresh the list of roles in the parent
    } catch (error) {
      toast({ title: "Error", description: "Failed to create role.", variant: "destructive" });
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      // Here you would call your adminService to update the user's roles
      // await adminService.setUserRoles(user.id, selectedRoleIds);
      console.log(`Simulating update for user ${user.email} with roles:`, selectedRoleIds);
      await new Promise(res => setTimeout(res, 1000)); // Simulate network delay

      toast({ title: "Success", description: "User roles updated." });
      onRolesChanged();
      onClose();
    } catch (error) {
      toast({ title: "Error", description: "Failed to update user roles.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Edit Roles for {user.email}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Assign Roles</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto p-2 border rounded-md">
              {allRoles.map(role => (
                <div key={role.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`role-${role.id}`}
                    checked={selectedRoleIds.includes(role.id)}
                    onCheckedChange={() => handleRoleToggle(role.id)}
                  />
                  <Label htmlFor={`role-${role.id}`}>{role.name}</Label>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Create New Role</h3>
            <div className="flex gap-2">
              <Input
                placeholder="New role name"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
              />
              <Button onClick={handleCreateRole} disabled={!newRoleName.trim()}>Create</Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSaveChanges} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
