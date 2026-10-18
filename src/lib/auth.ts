import { betterAuth } from "better-auth";
import { dash } from "@better-auth/infra";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || "development-sample-secret-change-in-production-12345678",
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [
    dash(),
  ],
});
