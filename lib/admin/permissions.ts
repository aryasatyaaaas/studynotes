import { UserRole } from "@/generated/prisma/client"

const hierarchy: Record<UserRole, number> = {
    USER: 0,
    ADMIN: 1,
    SUPER_ADMIN: 2,
}

export function canAccess(userRole: UserRole, requiredRole: UserRole): boolean {
    return hierarchy[userRole] >= hierarchy[requiredRole]
}

export function requireAdmin(userRole: UserRole) {
    if (!canAccess(userRole, "ADMIN")) {
        throw new Error("Forbidden: requires ADMIN role")
    }
}

export function requireSuperAdmin(userRole: UserRole) {
    if (!canAccess(userRole, "SUPER_ADMIN")) {
        throw new Error("Forbidden: requires SUPER_ADMIN role")
    }
}

export function checkAdminAccess(role: UserRole, required: UserRole = "ADMIN"): Response | null {
    if (!canAccess(role, required)) {
        return Response.json({ error: "Forbidden" }, { status: 403 })
    }
    return null
}
