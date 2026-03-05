import { prisma } from "./lib/prisma";

async function main() {
    try {
        await prisma.$executeRawUnsafe(`ALTER TABLE "Note" ADD COLUMN "deletedAt" TIMESTAMP(3);`);
        console.log("Successfully added deletedAt column.");
    } catch (e) {
        console.error("Error or column already exists:", e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
