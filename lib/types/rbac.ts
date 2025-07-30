export interface Permission {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Role {
  id: string;
  name: string;
  created_at: string;
}

export interface RolePermission {
  role_id: string;
  permission_id: string;
  roles?: Role;
  permissions?: Permission;
}

export interface UserRole {
  user_id: string;
  role_id: string;
  roles?: Role;
}

export interface RoleWithPermissions extends Role {
  permissions: Permission[];
}

export interface PermissionWithRoles extends Permission {
  roles: Role[];
}