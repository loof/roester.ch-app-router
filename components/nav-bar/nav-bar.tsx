"use client"

import React, { useState } from 'react';
import {useTheme} from "next-themes";
import LogoLink from "@/components/nav-bar/logo-link";
import MobileMenuButton from "@/components/nav-bar/mobile-menu-button";
import DesktopNavLinks from "@/components/nav-bar/desktop-nav-links";
import MobileDrawer from "@/components/nav-bar/mobile-drawer";

export default  function NavBar() {
    const { setTheme } = useTheme()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleDrawerToggle = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    return (<>
            <div className="border-b px-6 border-primary-foreground/20 pb-5 hidden container sm:flex flex-row justify-between items-center text-center max-w-screen-lg">
                <LogoLink />
                <DesktopNavLinks />
            </div>
            <div className="sm:hidden">
                <LogoLink />
                <MobileMenuButton onClick={handleDrawerToggle} />
                <MobileDrawer isOpen={isDrawerOpen} onClose={handleDrawerToggle} />
            </div>
        </>

    )
}