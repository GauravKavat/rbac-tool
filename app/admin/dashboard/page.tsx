// app/admin/dashboard/page.tsx

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "@/app/dashboard/dashboard-client"; // Re-using the existing client
import { permissionService, roleService } from "@/lib/services/rbac";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  // You should add logic here to check if the user has an 'Administrator' role
  // For now, we'll allow any authenticated user to see it.

  const [roles, permissions] = await Promise.all([
    roleService.getAllWithPermissions(),
    permissionService.getAll(),
  ]);

  return (
    <div className="w-full max-w-7xl px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Portal</h1>
        <p className="text-muted-foreground mt-2">
          Manage users, roles, and permissions for your application.
        </p>
      </div>
      
      <DashboardClient initialRoles={roles} initialPermissions={permissions} />
    </div>
  );
}