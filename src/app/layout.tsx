import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/context/auth-context";
import { Toaster } from "@/components/ui/toaster";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Personal Finance Manager",
  description: "Manage your personal finances, track expenses, and achieve your financial goals.",
  authors: [
    { name: "Personal Finance App", url: "https://personal-finance-app.vercel.app/" },
  ],
  keywords: [
    "Personal Finance",
    "Expense Tracker",
    "Budget Management",
    "Financial Goals",
    "Money Management",
    "Income Tracking",
    "Financial Planning",
  ],
  creator: "Personal Finance App",
  publisher: "Personal Finance App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable}`} suppressHydrationWarning>
      <body
        className={`${outfit.className} w-screen min-h-screen m-0 p-0 overflow-x-hidden`}
      >
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider> */}
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
