import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format permission name to be more user-friendly
 * Converts SNAKE_CASE or kebab-case to Title Case
 * Example: "CREATE_USER" -> "Create User", "manage-roles" -> "Manage Roles"
 */
export function formatPermissionName(name: string): string {
  return name
    .split(/[_-]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}
