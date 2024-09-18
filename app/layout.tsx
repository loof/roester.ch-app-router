import type {Metadata} from "next";
import "./globals.css";
import {ThemeProvider} from "@/components/theme-provider";
import localFont from 'next/font/local'
import NavBar from "@/components/nav-bar/nav-bar";
import {Toaster} from "@/components/ui/toaster"
import SessionWrapper from "@/components/session-wrapper";


export const metadata: Metadata = {
    title: "RÖSTER.CH",
    description: "",
};

const fontMontserrat = localFont({
    src: './fonts/montserrat/Montserrat-Regular.ttf',
    display: 'swap',
})


export default function RootLayout(props) {

    return (
        <SessionWrapper>
        <html lang="de" className={fontMontserrat.className}>
        <body>
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
            >
                <NavBar/>
                <div className="pt-48">
                    {props.children}
                </div>
                <Toaster/>
            </ThemeProvider>
        </body>
        </html>
        </SessionWrapper>
    );
}