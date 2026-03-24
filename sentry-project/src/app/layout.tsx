import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sentry 학습 프로젝트",
  description: "Next.js + Hono + Sentry 모니터링 학습용 프로젝트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 dark:bg-gray-950">
        <nav className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
            <a href="/" className="text-lg font-bold text-gray-900 dark:text-white">
              Sentry Lab
            </a>
            <div className="flex gap-4 text-sm">
              <a href="/" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                Home
              </a>
              <a href="/test/error" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                Error Test
              </a>
              <a href="/test/performance" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                Performance
              </a>
            </div>
          </div>
        </nav>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
