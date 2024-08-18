"use client"

import React, { useState } from 'react';
import {useTheme} from "next-themes";
import LogoLink from "@/components/logo-link";
import MobileMenuButton from "@/components/mobile-menu-button";
import DesktopNavLinks from "@/components/desktop-nav-links";
import MobileDrawer from "@/components/mobile-drawer";

export default  function NavBar() {
    const { setTheme } = useTheme()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleDrawerToggle = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    return (<>
            <div className="border-b px-6 border-primary-foreground/20 pb-5 hidden container sm:flex flex-row justify-between items-center text-center max-w-screen-sm">
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