import { defineConfig } from "prisma/config";

if (!process.env.DATABASE_URL) {
    // Only load dotenv in local development
    require("dotenv").config();
}

export default defineConfig({
    schema: "./prisma/schema.prisma",
    datasource: {
        url: process.env.DATABASE_URL!,
    },
});
