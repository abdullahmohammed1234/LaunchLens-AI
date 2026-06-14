import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/portfolio/:path*",
    "/projects/:path*",
    "/analyzer/:path*",
    "/simulator/:path*",
    "/roadmap/:path*",
    "/team/:path*",
    "/compare/:path*",
    "/reports/:path*",
    "/mentor/:path*",
    "/settings/:path*",
    "/auth/:path*",
  ],
};
