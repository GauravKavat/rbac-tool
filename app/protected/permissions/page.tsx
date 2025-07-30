import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PermissionsClient from "./permissions-client";

export default async function PermissionsPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: permissions, error } = await supabase.from("permissions").select("*");

  if (error) {
    console.error("Error fetching permissions:", error);
    // Handle error appropriately
    return <div>Error loading permissions.</div>;
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">Permission Management</h1>
      <PermissionsClient permissions={permissions || []} />
    </div>
  );
}