import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const protectedRoutes = ["/dashboard", "/notes", "/subjects"];
const authRoutes = ["/login", "/register"];
const adminRoutes = ["/admin"];

export default async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    const isProtectedRoute = protectedRoutes.some(
        (route) => pathname === route || pathname.startsWith(route + "/")
    );
    const isAuthRoute = authRoutes.some((route) => pathname === route);
    const isAdminRoute = adminRoutes.some(
        (route) => pathname === route || pathname.startsWith(route + "/")
    );

    // Admin route protection
    if (isAdminRoute) {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return NextResponse.redirect(new URL("/login?redirect=/admin", request.url));
        }

        // Get user with role
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true },
        });

        if (!user || user.role === "USER") {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        return NextResponse.next();
    }

    // Maintenance mode check for non-admin routes
    if (isProtectedRoute) {
        try {
            const setting = await prisma.appSetting.findUnique({
                where: { key: "maintenanceMode" },
            });

            if (setting?.value === "true") {
                const session = await auth.api.getSession({
                    headers: await headers(),
                });

                if (!session) {
                    return NextResponse.redirect(new URL("/maintenance", request.url));
                }

                const user = await prisma.user.findUnique({
                    where: { id: session.user.id },
                    select: { role: true },
                });

                if (!user || user.role === "USER") {
                    return NextResponse.redirect(new URL("/maintenance", request.url));
                }
            }
        } catch {
            // AppSetting table might not exist yet — skip maintenance check
        }
    }

    if (isProtectedRoute || isAuthRoute) {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session && isProtectedRoute) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        if (session && isAuthRoute) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }

    return NextResponse.next();
}
