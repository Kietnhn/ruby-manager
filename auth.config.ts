import type { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { getEmployeeById } from "./lib/actions/user";
import { Role } from "@prisma/client";
import { getEmployee } from "./lib/actions";
// import { getUserByEmail } from "./lib/actions";
export const authConfig = {
    pages: {
        signIn: "/auth/login-credentials",

        error: "auth/error",
        // verifyRequest: "auth/verify-request",
    },
    events: {},
    callbacks: {
        // async signIn({ user, account }) {
        //     if (account?.provider !== "credentials") return true;

        //     const existedUser = await getEmployee(user.email as string);
        //     if (!existedUser || !existedUser.emailVerified) return false;

        //     return true;
        // },
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                return Response.redirect(new URL("/dashboard", nextUrl));
            }
            return true;
        },

        async session({ token, session }) {
            // console.log("Session Token", token);
            // console.log("User session", session.user);
            // if (token.sub && session.user) {
            //     session.user.id = token.sub;
            // }
            // if (token.role && session.user) {
            //     session.user.role = token.role as Role;
            // }
            return session;
        },
        async jwt({ token, account, user }) {
            // console.log("JWT Token", token);

            // if (!token.sub) {
            //     return token;
            // }
            // const existedUser = await getEmployeeById(token.sub);
            // if (!existedUser) return token;
            // token.role = existedUser.employee.role;
            return token;
        },
    },

    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24 * 30,
    },
    adapter: PrismaAdapter(prisma),
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
