import { UserRole } from "./type";

/**
 * Check if user has required role
 */
export function hasRole(userRole: UserRole | null | undefined, requiredRole: UserRole | UserRole[]): boolean {
  if (!userRole) return false;
  
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }
  
  return userRole === requiredRole;
}

/**
 * Check if user has admin role
 */
export function isAdmin(role: UserRole | null | undefined): boolean {
  return role === "admin";
}

/**
 * Check if user is organizer or admin
 */
export function isOrganizerOrAdmin(role: UserRole | null | undefined): boolean {
  return role === "organizer" || role === "admin";
}

/**
 * Check if user is organizer
 */
export function isOrganizer(role: UserRole | null | undefined): boolean {
  return role === "organizer";
}

/**
 * Check if user is regular user
 */
export function isUser(role: UserRole | null | undefined): boolean {
  return role === "user";
}

/**
 * Get allowed roles for a route
 */
export function getAllowedRoles(route: string): UserRole[] {
  // Admin routes
  if (route.startsWith("/admin")) {
    return ["admin"];
  }
  
  // Organizer routes
  if (route.startsWith("/organizer")) {
    return ["organizer", "admin"];
  }
  
  // User routes (public or authenticated)
  if (route.startsWith("/user") || route.startsWith("/events") || route.startsWith("/")) {
    return ["user", "organizer", "admin", "staff"];
  }
  
  // Auth routes (no role required)
  if (route.startsWith("/login") || route.startsWith("/register") || route.startsWith("/forgot-password")) {
    return [];
  }
  
  return [];
}
