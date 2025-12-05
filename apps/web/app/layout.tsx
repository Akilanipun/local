import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LocationProvider } from "@/components/LocationProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Local - Hyper-Local News",
    description: "Your trusted source for verified local news",
    manifest: "/manifest.json",
    themeColor: "#0ea5e9",
    viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/icon-192x192.png" />
            </head>
            <body className={inter.className}>
                <LocationProvider>
                    {children}
                </LocationProvider>
            </body>
        </html>
    );
}
