import type { Metadata } from "next";
import { Merriweather, Source_Sans_3 } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { UnhandledRejectionHandler } from "@/components/providers/unhandled-rejection-handler";
import { CartProvider } from "@/lib/cart-context";
import "./globals.css";

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-heading",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hartmann UG & Co. KG · Feuerwerksverkauf",
  description:
    "Tradition, Erfahrung und zuverlässiger Feuerwerksverkauf seit Jahrzehnten. Hartmann UG & Co. KG – Rödental.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${merriweather.variable} ${sourceSans.variable}`}>
      <body className="font-body antialiased">
        <UnhandledRejectionHandler>
          <CartProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </UnhandledRejectionHandler>
      </body>
    </html>
  );
}
