import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ảnh dùng thẻ <img> thường để chạy tốt cả khi offline/không cấu hình CDN
  images: { unoptimized: true },
  experimental: {
    serverActions: { bodySizeLimit: "10mb" },
  },
};

export default nextConfig;
