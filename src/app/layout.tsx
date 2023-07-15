'use client'
import { Header } from "@/components/header";
import "./globals.css";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Tarefas+ | Organize suas tarefas",
  description: "organize suas tarefas",
};

export default function RootLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session:any;
}) {
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={inter.className}>
          <Header />
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
