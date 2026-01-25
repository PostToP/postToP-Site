import AuthProvider from "@/provider/AuthProvider";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PostToP",
  description: "A Youtube music classifier and tracker for developers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={"antialiased"}>{children}</body>
      </AuthProvider>
    </html>
  );
}
