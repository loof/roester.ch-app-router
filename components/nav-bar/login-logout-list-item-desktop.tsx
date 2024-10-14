"use client"

import Link from "next/link";
import {useEffect, useState} from "react";
import {redirect, usePathname, useRouter} from "next/navigation";
import {signOut, useSession} from "next-auth/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {LogIn, LogOut, Settings, User} from "lucide-react";
import {router} from "next/client";
import {clsx} from "clsx";

export default function LoginLogoutListItemDesktop({className} : {className?: string}) {
    const pathname = usePathname();
    const {data: session} = useSession();
    const [isLoggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        if (session?.user?.accessToken) {
            setLoggedIn(true)
        }
    }, [pathname, session]);



    return (<li className={className}>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <User className="h-5 w-5"/>
                    <span className="sr-only">Benutzermenü öffnen</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {isLoggedIn ? (
                    <>
                    <Link href={"/profile"}   passHref legacyBehavior>
                        <DropdownMenuItem className={clsx('hover:text-primary', {
                            'text-primary': pathname.startsWith("/profile"),
                            'text-primary-foreground': !pathname.startsWith("/profile")
                        })}>
                            <User className="mr-2 h-4 w-4"/>
                            <span>Profil</span>
                        </DropdownMenuItem>
                    </Link>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={e => {signOut()}}>
                            <LogOut className="mr-2 h-4 w-4"/>
                            <span>Abmelden</span>
                        </DropdownMenuItem>
                    </>
                ) : (
                    <Link href={`/login?next=${pathname}`} passHref legacyBehavior>
                        <DropdownMenuItem asChild>
                            <a className="flex items-center cursor-pointer">
                                <LogIn className="mr-2 h-4 w-4" />
                                <span>Anmelden</span>
                            </a>
                        </DropdownMenuItem>
                    </Link>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    </li>)
}