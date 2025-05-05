import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import "../style/globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { trpc } from '../utils/trpc';

const inter = Inter({ subsets: ["latin"] });

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className={inter.className}>
                <Component {...pageProps} />
                <Toaster position="bottom-right" />
            </div>
        </ThemeProvider>
    );
}

export default trpc.withTRPC(App);