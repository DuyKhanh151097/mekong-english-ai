import { PrismaClient } from "@prisma/client";

// Tái sử dụng một PrismaClient trong môi trường dev (tránh tạo nhiều kết nối khi hot-reload)
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
