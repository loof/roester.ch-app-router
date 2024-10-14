"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";
import {clsx} from "clsx";
import {usePathname} from "next/navigation";

export default function LoginLogoutListItemMobile({onClose } : {onClose: () => void}) {
    const { data: session } = useSession();
    const [isLoggedIn, setLoggedIn] = useState(false);
    const pathname = usePathname()


    useEffect(() => {
        if (session?.user?.accessToken) {
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }
    }, [session]);

    return (
        <>
            {isLoggedIn ? (
                <>

                    <li>
                        <Link className={"text-foreground flex text-3xl hover:text-primary"} href={"#"} onClick={(e) => {
                            e.preventDefault();
                            signOut();
                        }}>
                            Abmelden
                        </Link>
                    </li>

                </>

            ) : (
                <li>
                    <Link onClick={e => {
                        onClose()
                    }} className={"text-foreground flex text-3xl hover:text-primary"} href={"/login"}>
                        Login
                    </Link>
                </li>
            )}
        </>
    );
}
