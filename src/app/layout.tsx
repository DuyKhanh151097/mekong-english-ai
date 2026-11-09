import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const font = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "MEKONG English AI – Mỗi ngày 15 phút, nói tiếng Anh tự tin",
    template: "%s | MEKONG English AI",
  },
  description:
    "Ứng dụng học tiếng Anh thông minh gắn với học tập, đời sống và nghề nghiệp địa phương An Giang. Video bài giảng, luyện nói với gia sư AI, luyện nói trực tiếp với giáo viên.",
  applicationName: "MEKONG English AI",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/images/logo-mark.jpg", apple: "/images/logo-mark.jpg" },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "MEKONG English AI",
    images: ["/images/hero.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0F9D58",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={font.variable}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
