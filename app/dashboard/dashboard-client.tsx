// app/dashboard/dashboard-client.tsx

"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PermissionsTab } from "@/components/dashboard/permissions-tab";
import { RolesTab } from "@/components/dashboard/roles-tab";
import { RolePermissionsTab } from "@/components/dashboard/role-permissions-tab";
import { UserManagementTab } from "@/components/dashboard/user-management-tab"; // New import
import { NaturalLanguageTab } from "@/components/dashboard/natural-language-tab";
import { Shield, Users, Link as LinkIcon, Bot, UserCog } from "lucide-react"; // New icons
import type { Permission, RoleWithPermissions } from '@/lib/types/rbac';

export function DashboardClient({ initialRoles, initialPermissions }: {
  initialRoles: RoleWithPermissions[],
  initialPermissions: Permission[]
}) {
  const [roles, setRoles] = useState(initialRoles);
  const [permissions, setPermissions] = useState(initialPermissions);

  const onDataChange = (newData: { roles?: RoleWithPermissions[], permissions?: Permission[] }) => {
    if (newData.roles) setRoles(newData.roles);
    if (newData.permissions) setPermissions(newData.permissions);
  };

  return (
    <>
      <Tabs defaultValue="user-management" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="user-management" className="flex items-center gap-2">
            <UserCog className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="role-permissions" className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            Role-Permissions
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Permissions
          </TabsTrigger>
          <TabsTrigger value="natural-language" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            AI Assistant
          </TabsTrigger>
        </TabsList>

        <TabsContent value="user-management">
          <UserManagementTab />
        </TabsContent>

        <TabsContent value="role-permissions">
          <RolePermissionsTab roles={roles} permissions={permissions} onDataChange={onDataChange} />
        </TabsContent>

        <TabsContent value="roles">
          <RolesTab roles={roles} onDataChange={onDataChange} />
        </TabsContent>

        <TabsContent value="permissions">
          <PermissionsTab permissions={permissions} onDataChange={onDataChange} />
        </TabsContent>

        <TabsContent value="natural-language">
          <NaturalLanguageTab />
        </TabsContent>
      </Tabs>
    </>
  );
}