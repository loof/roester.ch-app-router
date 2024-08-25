import type {Metadata} from "next";
import "./globals.css";
import {ThemeProvider} from "@/components/theme-provider";
import localFont from 'next/font/local'
import NavBar from "@/components/nav-bar/nav-bar";
import {Toaster} from "@/components/ui/toaster"


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
        <html lang="de" className={fontMontserrat.className}>
        <body className={"h-screen pt-10 flex flex-col"}>
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
            >
                <NavBar/>
                {props.children}
                <Toaster/>
            </ThemeProvider>
        </body>
        </html>
    );
}