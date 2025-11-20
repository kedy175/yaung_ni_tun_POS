// lib/auth.ts

import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { prisma } from "@/lib/prisma";
// 1. Initialize the Prisma Adapter
const adapter = new PrismaAdapter(prisma.session, prisma.user); 
// NOTE: Lucia requires a 'session' table. You will create this next!

// 2. Initialize Lucia
export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            // set to `true` when using HTTPS (required for Vercel/Neon deployment)
            secure: process.env.NODE_ENV === "production", 
        }
    },
    // Define what user data is available after authentication
    getUserAttributes: (attributes) => {
        return {
            // Expose only non-sensitive data
            email: attributes.email,
            role: attributes.role,
            name: attributes.name,
        };
    },
});

// TypeScript declaration to ensure correct typing across your app
declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: DatabaseUserAttributes;
    }
}

interface DatabaseUserAttributes {
    email: string;
    role: "ADMIN" | "EMPLOYEE";
    name: string | null;
}