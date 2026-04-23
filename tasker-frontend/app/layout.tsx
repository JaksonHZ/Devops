import type { Metadata } from "next";
import { Inter, League_Spartan } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const leagueSpartan = League_Spartan({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tasker",
  description: "Tasker is a simple task manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={leagueSpartan.className}>{children}</body>
    </html>
  );
}
