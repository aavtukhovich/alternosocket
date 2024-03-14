import "./globals.css";
import type { Metadata } from "next";

import Header from "./sections/Header";
import Footer from "./sections/Footer";
import GTag from "./components/header/GTag";
import YandexMetrika from "./components/header/YandexMetrika";

import { Urbanist } from "next/font/google";

import { SystemProvider } from "./context/SystemContext";
import { HERO_HEADING, HERO_DESCRIPTION } from "@/data/Texts";
import { DOMAIN } from "./context/constants";

const font = Urbanist({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        default: "Alterno | 3D Model NFT Marketplace",
        template: "%s - Alterno | 3D Model NFT Marketplace",
    },
    applicationName: "Alterno",
    description: HERO_HEADING + " " + HERO_DESCRIPTION + " Explore more at Alterno!",
    generator: "Next.js",
    keywords: ["NFT", "3D Model", "Metaverse"],
    publisher: "Alterno",
    metadataBase: new URL(DOMAIN),
    openGraph: {
        title: "Alterno | 3D Model NFT Marketplace",
        description: "Alterno | 3D Model NFT Marketplace",
        url: DOMAIN,
        siteName: "Alterno | 3D Model NFT Marketplace",
        locale: "en_US",
        type: "website",
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <GTag GA_TRACKING_ID={process.env.NEXT_PUBLIC_GTAG_ID as string} />
            <YandexMetrika counterId={process.env.NEXT_PUBLIC_YANDEX_ID as string} />
            <body className={font.className}>
                <SystemProvider>
                    <Header />
                    <main>{children}</main>
                    <Footer />
                </SystemProvider>
            </body>
        </html>
    );
}
