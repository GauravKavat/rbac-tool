import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "./dashboard-client";
import { permissionService, roleService } from "@/lib/services/rbac";

export default async function DashboardPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  const [roles, permissions] = await Promise.all([
    roleService.getAllWithPermissions(),
    permissionService.getAll(),
  ]);

  return (
    <div className="w-full max-w-7xl px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">RBAC Configuration Tool</h1>
        <p className="text-muted-foreground mt-2">
          Manage roles, permissions, and access control for your application
        </p>
      </div>
      
      <DashboardClient initialRoles={roles} initialPermissions={permissions} />
    </div>
  );
}