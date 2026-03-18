import type { Metadata } from "next";
import {
  Playfair_Display, Inter, Lora,
  Cormorant_Garamond, Libre_Baskerville, Merriweather, EB_Garamond, Crimson_Text,
  DM_Serif_Display, Lato, Montserrat, Open_Sans, Raleway, Nunito, Josefin_Sans,
  Oswald, Bebas_Neue, Abril_Fatface,
} from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], display: "swap" });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const lora = Lora({ variable: "--font-lora", subsets: ["latin"], display: "swap" });
const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], display: "swap", weight: ["300", "400", "600", "700"] });
const libreBaskerville = Libre_Baskerville({ variable: "--font-libre-baskerville", subsets: ["latin"], display: "swap", weight: ["400", "700"] });
const merriweather = Merriweather({ variable: "--font-merriweather", subsets: ["latin"], display: "swap", weight: ["300", "400", "700"] });
const ebGaramond = EB_Garamond({ variable: "--font-eb-garamond", subsets: ["latin"], display: "swap" });
const crimsonText = Crimson_Text({ variable: "--font-crimson-text", subsets: ["latin"], display: "swap", weight: ["400", "600", "700"] });
const dmSerifDisplay = DM_Serif_Display({ variable: "--font-dm-serif-display", subsets: ["latin"], display: "swap", weight: "400" });
const lato = Lato({ variable: "--font-lato", subsets: ["latin"], display: "swap", weight: ["300", "400", "700"] });
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"], display: "swap" });
const openSans = Open_Sans({ variable: "--font-open-sans", subsets: ["latin"], display: "swap" });
const raleway = Raleway({ variable: "--font-raleway", subsets: ["latin"], display: "swap" });
const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"], display: "swap" });
const josefinSans = Josefin_Sans({ variable: "--font-josefin-sans", subsets: ["latin"], display: "swap" });
const oswald = Oswald({ variable: "--font-oswald", subsets: ["latin"], display: "swap" });
const bebasNeue = Bebas_Neue({ variable: "--font-bebas-neue", subsets: ["latin"], display: "swap", weight: "400" });
const abrilFatface = Abril_Fatface({ variable: "--font-abril-fatface", subsets: ["latin"], display: "swap", weight: "400" });

const fontVars = [
  playfair, inter, lora, cormorant, libreBaskerville, merriweather,
  ebGaramond, crimsonText, dmSerifDisplay, lato, montserrat, openSans,
  raleway, nunito, josefinSans, oswald, bebasNeue, abrilFatface,
].map((f) => f.variable).join(' ');

export const metadata: Metadata = {
  title: "Brochure Maker",
  description: "AI-powered property brochure generator for estate agents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fontVars} antialiased`}>
        {children}
      </body>
    </html>
  );
}
