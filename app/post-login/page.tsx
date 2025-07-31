// app/post-login/page.tsx

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function PostLoginPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/auth/login');
  }

  // Check if user has the 'Administrator' role
  const { data: userRole } = await supabase
    .from('user_roles')
    .select('roles(name)')
    .eq('user_id', user.id)
    .single();

  if (userRole?.roles?.[0]?.name === 'Administrator') {
    return redirect('/admin/dashboard');
  }

  // Redirect all other users to a general protected page
  return redirect('/protected');
}