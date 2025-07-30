import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">RBAC Configuration Tool</h1>
        <p className="text-muted-foreground mt-2">
          Manage roles, permissions, and access control for your application
        </p>
      </div>
      
      <DashboardTabs />
    </div>
  );
}