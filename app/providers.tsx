// app/providers.tsx
"use client";

import { AVAILABLE_THEMES } from "@/lib/constants";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "next-themes";
export function UIProviders({ children }: { children: React.ReactNode }) {
    return (
        <NextUIProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="light"
                themes={AVAILABLE_THEMES}
            >
                {children}
            </ThemeProvider>
        </NextUIProvider>
    );
}
