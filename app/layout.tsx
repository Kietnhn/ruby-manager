import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReduxProvider from "./store-provider";
import { UIProviders } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Ruby manager",
    description: "Ruby manager",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className} suppressHydrationWarning={true}>
                <UIProviders>
                    <ReduxProvider>{children}</ReduxProvider>
                    <ToastContainer />
                </UIProviders>
            </body>
        </html>
    );
}
