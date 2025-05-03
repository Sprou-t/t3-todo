import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "T3 Todo App",
    description: "A simple todo app built with the T3 stack",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    {children}
                    <Toaster position="bottom-right" />
                </ThemeProvider>
            </body>
        </html>
    )
}
