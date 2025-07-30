"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PermissionsTab } from "./permissions-tab";
import { RolesTab } from "./roles-tab";
import { RolePermissionsTab } from "./role-permissions-tab";
import { NaturalLanguageTab } from "./natural-language-tab";
import { Shield, Users, Link, MessageSquare } from "lucide-react";

export function DashboardTabs() {
  return (
    <Tabs defaultValue="permissions" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="permissions" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Permissions
        </TabsTrigger>
        <TabsTrigger value="roles" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Roles
        </TabsTrigger>
        <TabsTrigger value="role-permissions" className="flex items-center gap-2">
          <Link className="h-4 w-4" />
          Role-Permissions
        </TabsTrigger>
        <TabsTrigger value="natural-language" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Natural Language
        </TabsTrigger>
      </TabsList>

      <TabsContent value="permissions">
        <PermissionsTab />
      </TabsContent>

      <TabsContent value="roles">
        <RolesTab />
      </TabsContent>

      <TabsContent value="role-permissions">
        <RolePermissionsTab />
      </TabsContent>

      <TabsContent value="natural-language">
        <NaturalLanguageTab />
      </TabsContent>
    </Tabs>
  );
}