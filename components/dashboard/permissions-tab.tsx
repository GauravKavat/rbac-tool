// components/dashboard/permissions-tab.tsx

"use client";

import type { Permission } from "@/lib/types/rbac";

// Simulate current user permissions (in real app, get from auth/session/role)
const CURRENT_USER_PERMISSION_IDS = ["perm-1", "perm-2"];

export function PermissionsTab({ permissions }: { 
  permissions: Permission[];
  onDataChange: (data: { permissions: Permission[] }) => void;
}) {
  // Filter permissions to only those the user has
  const userPermissions = permissions.filter(p => CURRENT_USER_PERMISSION_IDS.includes(p.id));

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Your Permissions</h2>
      {userPermissions.length > 0 ? (
        <ul className="list-disc ml-6">
          {userPermissions.map(p => (
            <li key={p.id}>{p.name}</li>
          ))}
        </ul>
      ) : (
        <div className="italic text-muted-foreground">You do not have any permissions assigned.</div>
      )}
      <p className="text-xs text-muted-foreground mt-2">You can only view your permissions here. Modification is not allowed.</p>
    </div>
  );
}