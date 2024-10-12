"use client"

import React, { useState } from 'react';
import {useTheme} from "next-themes";
import LogoLink from "@/components/nav-bar/logo-link";
import MobileMenuButton from "@/components/nav-bar/mobile-menu-button";
import DesktopNavLinks from "@/components/nav-bar/desktop-nav-links";
import MobileDrawer from "@/components/nav-bar/mobile-drawer";
import { useSession, signIn, signOut } from "next-auth/react"

export default  function NavBar({className}: {className?: string}) {
    const { setTheme } = useTheme()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { data: session } = useSession()
    const handleDrawerToggle = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    return (<>
            <div className={`fixed z-10 opacity-95 inset-x-0 pt-10 pb-6 mx-auto bg-black border-b px-6 border-primary-foreground/20 hidden sm:flex flex-row justify-between items-center text-center max-w-screen-lg  ${className}`}>
                <LogoLink />
                <DesktopNavLinks />
            </div>
            <div className={`sm:hidden fixed z-10 opacity-95 inset-x-0 pb-6 mx-auto bg-black border-b px-6 border-primary-foreground/20 flex-row justify-between items-center text-center max-w-screen-lg  ${className}`}>
                <LogoLink />
                <MobileMenuButton onClick={handleDrawerToggle} />
                <MobileDrawer isOpen={isDrawerOpen} onClose={handleDrawerToggle} />
            </div>
        </>

    )
}