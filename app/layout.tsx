import type { Metadata } from "next";
import { Domine, Montserrat } from "next/font/google";
import "./globals.css";

const domine = Domine({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-domine",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Salmorize",
  description: "Uma jornada espiritual de memorização dos Salmos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
     <body className={`${domine.variable} ${montserrat.variable} bg-gray-1`}>
        <div className="max-w-md mx-auto min-h-screen">
            {children}
        </div>
      </body>
    </html>
  );
}