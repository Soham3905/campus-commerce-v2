import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "@/store/StoreProvider";

export const metadata: Metadata = {
  title: "Campus Commerce - VNIT",
  description: "Campus-Commerce Student Portal for VNIT",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-50 text-zinc-900 antialiased selection:bg-emerald-800 selection:text-white">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
