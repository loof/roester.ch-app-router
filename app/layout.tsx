import type {Metadata} from "next";
import "./globals.css";
import {ThemeProvider} from "@/components/theme-provider";
import localFont from 'next/font/local'
import NavBar from "@/components/nav-bar/nav-bar";
import {Toaster} from "@/components/ui/toaster"
import {UserProvider} from '@auth0/nextjs-auth0/client';

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
        <body className={"mt-10"}>
        <UserProvider>
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
        </UserProvider>
        </body>
        </html>
    );
}