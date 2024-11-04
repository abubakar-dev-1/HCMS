import type { Metadata } from "next";
import localFont from "next/font/local";
import Navbar from "@/components/navbar"; // Now handled by the Navbar component itself
import "./globals.css";
import Footer from "@/components/footer";

// Font configurations
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Metadata for SEO
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

// Main layout component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className=" w-full" >
          <Navbar />
        </div>
        <div className="flex flex-col min-h-screen">{children}
        <Footer/>
        </div>
      </body>
    </html>
  );
}
