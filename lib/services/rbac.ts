import { createClient } from '@/lib/supabase/client';
import type { Permission, Role, RoleWithPermissions, PermissionWithRoles } from '@/lib/types/rbac';

const supabase = createClient();

// Permission CRUD operations
export const permissionService = {
  async getAll(): Promise<Permission[]> {
    const { data, error } = await supabase
      .from('permissions')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Permission | null> {
    const { data, error } = await supabase
      .from('permissions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(permission: Omit<Permission, 'id' | 'created_at'>): Promise<Permission> {
    const { data, error } = await supabase
      .from('permissions')
      .insert(permission)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, permission: Partial<Omit<Permission, 'id' | 'created_at'>>): Promise<Permission> {
    const { data, error } = await supabase
      .from('permissions')
      .update(permission)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('permissions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async getWithRoles(id: string): Promise<PermissionWithRoles | null> {
    const { data, error } = await supabase
      .from('permissions')
      .select(`
        *,
        role_permissions!inner(
          roles(*)
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) return null;
    
    return {
      ...data,
      roles: data.role_permissions?.map((rp: any) => rp.roles) || []
    };
  }
};

// Role CRUD operations
export const roleService = {
  async getAll(): Promise<Role[]> {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Role | null> {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(role: Omit<Role, 'id' | 'created_at'>): Promise<Role> {
    const { data, error } = await supabase
      .from('roles')
      .insert(role)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, role: Partial<Omit<Role, 'id' | 'created_at'>>): Promise<Role> {
    const { data, error } = await supabase
      .from('roles')
      .update(role)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('roles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async getWithPermissions(id: string): Promise<RoleWithPermissions | null> {
    const { data, error } = await supabase
      .from('roles')
      .select(`
        *,
        role_permissions(
          permissions(*)
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) return null;
    
    return {
      ...data,
      permissions: data.role_permissions?.map((rp: any) => rp.permissions) || []
    };
  },

  async getAllWithPermissions(): Promise<RoleWithPermissions[]> {
    const { data, error } = await supabase
      .from('roles')
      .select(`
        *,
        role_permissions(
          permissions(*)
        )
      `)
      .order('name');
    
    if (error) throw error;
    
    return (data || []).map(role => ({
      ...role,
      permissions: role.role_permissions?.map((rp: any) => rp.permissions) || []
    }));
  }
};

// Role-Permission relationship operations
export const rolePermissionService = {
  async assignPermissionToRole(roleId: string, permissionId: string): Promise<void> {
    const { error } = await supabase
      .from('role_permissions')
      .insert({ role_id: roleId, permission_id: permissionId });
    
    if (error) throw error;
  },

  async removePermissionFromRole(roleId: string, permissionId: string): Promise<void> {
    const { error } = await supabase
      .from('role_permissions')
      .delete()
      .eq('role_id', roleId)
      .eq('permission_id', permissionId);
    
    if (error) throw error;
  },

  async setRolePermissions(roleId: string, permissionIds: string[]): Promise<void> {
    // First, remove all existing permissions for this role
    await supabase
      .from('role_permissions')
      .delete()
      .eq('role_id', roleId);

    // Then, add the new permissions
    if (permissionIds.length > 0) {
      const { error } = await supabase
        .from('role_permissions')
        .insert(
          permissionIds.map(permissionId => ({
            role_id: roleId,
            permission_id: permissionId
          }))
        );
      
      if (error) throw error;
    }
  }
};