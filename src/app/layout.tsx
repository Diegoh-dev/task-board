'use client'
import { Header } from "@/components/header";
import "./globals.css";
import { Inter, Roboto } from "next/font/google";
import { SessionProvider } from "next-auth/react";

const roboto = Roboto({
  weight:[ '400','500','700'],
  subsets: ['latin'],
})

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
      <html lang="pt-br" suppressHydrationWarning={true}>
        <body className={roboto.className}>
          <Header />
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
