// components/dashboard/roles-tab.tsx

"use client";

import type { RoleWithPermissions } from "@/lib/types/rbac";

import { useState } from "react";
import { Button } from "@/components/ui/button";

// Simulate current user role (in real app, get from auth/session)
const CURRENT_USER_ROLE_ID = "user-role-id";

export function RolesTab({ roles, onDataChange }: { 
  roles: RoleWithPermissions[];
  onDataChange: (data: { roles: RoleWithPermissions[] }) => void;
}) {
  // Find the current user's role
  const userRole = roles.find(r => r.id === CURRENT_USER_ROLE_ID);
  const [removing, setRemoving] = useState(false);

  const handleRemoveSelfRole = async () => {
    setRemoving(true);
    // Simulate removal (in real app, call API)
    const updatedRoles = roles.filter(r => r.id !== CURRENT_USER_ROLE_ID);
    onDataChange({ roles: updatedRoles });
    setRemoving(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Your Role</h2>
      {userRole ? (
        <div className="border rounded-lg p-4 flex flex-col gap-2 items-start">
          <div>
            <span className="font-bold">Role:</span> {userRole.name}
          </div>
          <div>
            <span className="font-bold">Permissions:</span>
            <ul className="list-disc ml-6">
              {userRole.permissions.length > 0 ? userRole.permissions.map(p => (
                <li key={p.id}>{p.name}</li>
              )) : <li className="italic text-muted-foreground">No permissions</li>}
            </ul>
          </div>
          <Button variant="destructive" size="sm" onClick={handleRemoveSelfRole} disabled={removing}>
            {removing ? "Removing..." : "Remove My Role"}
          </Button>
          <p className="text-xs text-muted-foreground mt-2">You cannot assign yourself a new role or modify your own role's permissions here. You can only remove your own role and view its details.</p>
        </div>
      ) : (
        <div className="italic text-muted-foreground">You do not have a role assigned.</div>
      )}
    </div>
  );
}