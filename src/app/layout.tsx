import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
// import { _ThemeProvider } from "next-themes";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/context/auth-context";
import { Toaster } from "@/components/ui/toaster";
import { ThemeCustomProvider } from "@/lib/context/theme-context";
import { CurrencyCustomProvider } from "@/lib/context/currency-context";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Expense Tracker Manager",
  description:
    "Manage your Expense Trackers, track expenses, and achieve your financial goals.",
  authors: [
    {
      name: "Expense Tracker App",
      url: "https://personal-finance-app.vercel.app/",
    },
  ],
  keywords: [
    "Expense Tracker",
    "Expense Tracker",
    "Budget Management",
    "Financial Goals",
    "Money Management",
    "Income Tracking",
    "Financial Planning",
  ],
  creator: "Expense Tracker App",
  publisher: "Expense Tracker App",
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
        <ThemeCustomProvider>
          <CurrencyCustomProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </CurrencyCustomProvider>
        </ThemeCustomProvider>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
