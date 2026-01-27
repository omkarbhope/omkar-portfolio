import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import ProgressBar from "@/components/ui/ProgressBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Omkar Bhope - Full Stack Software Engineer",
  description: "Portfolio of Omkar Bhope - Full Stack Software Engineer specializing in AI/ML, infrastructure automation, and scalable systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)',
        }}
      >
        <ThemeProvider>
          <ProgressBar />
          <Navigation />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
