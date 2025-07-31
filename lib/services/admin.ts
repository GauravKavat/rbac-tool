// lib/services/admin.ts

import { createServerClient } from "@supabase/ssr";
import 'server-only';
import type { Role, UserWithRoles } from "../types/rbac";
import { cookies } from "next/headers";

// This creates a Supabase client with admin privileges
const createAdminClient = () => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        async getAll() {
          const cookieStore = await cookies();
          return cookieStore.getAll();
        },
        async setAll(...cookiesToSet) {
          try {
            const cookieStore = await cookies();
            const flat = cookiesToSet.flat();
            flat.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // The `setAll` method was called from a Server Component.
          }
        },
      },
    },
  );
};


export const adminService = {
  async getAllUsersWithRoles(): Promise<UserWithRoles[]> {
    const supabase = createAdminClient();
    
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    if (usersError) throw usersError;

    const userIds = users.map(user => user.id);

    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id, roles(id, name, created_at)')
      .in('user_id', userIds);

    if (rolesError) throw rolesError;
    
    const usersWithRoles = users.map(user => {
      const rolesForUser = userRoles
        ? userRoles.filter(ur => ur.user_id === user.id)
            // @ts-ignore - Supabase types can be tricky with nested selects
            .map(ur => ur.roles)
            .filter(Boolean)
        : [];

      // Flatten in case rolesForUser is an array of arrays or single objects
      const flatRoles = Array.isArray(rolesForUser) ? rolesForUser.flat() : [];

      return {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        roles: flatRoles,
      };
    });

    return usersWithRoles;
  },

  async setUserRoles(userId: string, roleIds: string[]): Promise<void> {
    const supabase = createAdminClient();

    const { error: deleteError } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);

    if (deleteError) throw deleteError;

    if (roleIds.length > 0) {
      const rolesToInsert = roleIds.map(roleId => ({
        user_id: userId,
        role_id: roleId,
      }));
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert(rolesToInsert);
      
      if (insertError) throw insertError;
    }
  }
};