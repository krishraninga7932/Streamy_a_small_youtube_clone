import dotenv from "dotenv";
import type { Config } from "drizzle-kit";

dotenv.config();

export default {
    schema: "./drizzle/schema.ts",
    out: "./drizzle/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DB_URL!,
    },
} satisfies Config;