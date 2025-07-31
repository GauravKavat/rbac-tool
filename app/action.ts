// app/actions.ts

"use server";

import { adminService } from "@/lib/services/admin";

export async function getAllUsers() {
  try {
    const users = await adminService.getAllUsersWithRoles();
    return { users };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { error: "Could not fetch users." };
  }
}