import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Calendar Pro - 自然背景高端日历应用",
  description: "一款以自然山景为背景的高端日历应用，具备完整事件管理、智能提醒、AI辅助等功能",
  manifest: "/manifest.json",
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body className={`${inter.className} bg-slate-900 text-white`}>{children}</body>
    </html>
  );
}
