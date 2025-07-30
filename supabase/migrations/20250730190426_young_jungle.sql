/*
  # RBAC Configuration Tool Database Schema

  1. New Tables
    - `permissions`
      - `id` (uuid, primary key)
      - `name` (text, unique, not null)
      - `description` (text, nullable)
      - `created_at` (timestamptz, default now())
    - `roles`
      - `id` (uuid, primary key)
      - `name` (text, unique, not null)
      - `created_at` (timestamptz, default now())
    - `role_permissions` (junction table)
      - `role_id` (uuid, foreign key to roles.id)
      - `permission_id` (uuid, foreign key to permissions.id)
      - Primary key: (role_id, permission_id)
    - `user_roles` (junction table)
      - `user_id` (uuid, foreign key to auth.users.id)
      - `role_id` (uuid, foreign key to roles.id)
      - Primary key: (user_id, role_id)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage RBAC data

  3. Sample Data
    - Insert default permissions and roles for testing
*/

-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create role_permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id uuid REFERENCES roles(id) ON DELETE CASCADE,
  permission_id uuid REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- Create user_roles junction table
CREATE TABLE IF NOT EXISTS user_roles (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id uuid REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

-- Enable Row Level Security
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies for permissions table
CREATE POLICY "Authenticated users can read permissions"
  ON permissions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage permissions"
  ON permissions
  FOR ALL
  TO authenticated
  USING (true);

-- Create policies for roles table
CREATE POLICY "Authenticated users can read roles"
  ON roles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage roles"
  ON roles
  FOR ALL
  TO authenticated
  USING (true);

-- Create policies for role_permissions table
CREATE POLICY "Authenticated users can read role_permissions"
  ON role_permissions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage role_permissions"
  ON role_permissions
  FOR ALL
  TO authenticated
  USING (true);

-- Create policies for user_roles table
CREATE POLICY "Authenticated users can read user_roles"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage user_roles"
  ON user_roles
  FOR ALL
  TO authenticated
  USING (true);

-- Insert sample permissions
INSERT INTO permissions (name, description) VALUES
  ('can_edit_articles', 'Permission to edit articles and content'),
  ('can_delete_users', 'Permission to delete user accounts'),
  ('can_view_dashboard', 'Permission to access the main dashboard'),
  ('can_manage_roles', 'Permission to create and modify roles'),
  ('can_publish_content', 'Permission to publish content to live site'),
  ('can_view_analytics', 'Permission to view site analytics and reports')
ON CONFLICT (name) DO NOTHING;

-- Insert sample roles
INSERT INTO roles (name) VALUES
  ('Administrator'),
  ('Content Editor'),
  ('Support Agent'),
  ('Viewer')
ON CONFLICT (name) DO NOTHING;

-- Assign permissions to roles
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Administrator'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Content Editor' AND p.name IN ('can_edit_articles', 'can_view_dashboard', 'can_publish_content')
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Support Agent' AND p.name IN ('can_view_dashboard', 'can_view_analytics')
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Viewer' AND p.name = 'can_view_dashboard'
ON CONFLICT DO NOTHING;