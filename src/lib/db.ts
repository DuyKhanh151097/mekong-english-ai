import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";

// Hỗ trợ môi trường serverless (Vercel/Netlify) ghi dữ liệu vào /tmp
if (process.env.VERCEL && (!process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("file:"))) {
  const tmpDbPath = path.join("/tmp", "dev.db");
  const seedDbPath = path.join(process.cwd(), "prisma", "seed.db");
  const devDbPath = path.join(process.cwd(), "prisma", "dev.db");

  if (!fs.existsSync(tmpDbPath)) {
    try {
      const sourceDb = fs.existsSync(seedDbPath) ? seedDbPath : fs.existsSync(devDbPath) ? devDbPath : null;
      if (sourceDb) {
        fs.copyFileSync(sourceDb, tmpDbPath);
      }
    } catch {
      // Bỏ qua lỗi sao chép nếu tệp chưa sẵn sàng
    }
  }

  process.env.DATABASE_URL = `file:${tmpDbPath}`;
}

// Tái sử dụng một PrismaClient trong môi trường dev (tránh tạo nhiều kết nối khi hot-reload)
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
