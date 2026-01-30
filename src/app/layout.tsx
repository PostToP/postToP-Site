import Navbar from "@/components/Layout/Navbar";
import AuthProvider from "@/provider/AuthProvider";
import type { Metadata } from "next";
import "../styles/globals.css";

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
    <html lang="en" className="min-h-screen">
      <body className={"antialiased max-w-[1500px] mx-auto bg-background-primary text-text-primary w-full"}>
        <AuthProvider>
          <Navbar />
          <main>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html >
  );
}
