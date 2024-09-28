"use client"

import {redirect, usePathname} from "next/navigation";
import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";

export default function CheckAuthAndRedirect({children} : {children: React.ReactNode}) {
    const pathname = usePathname()
    const { data: session } = useSession();
    const [isLoggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        if (session?.user?.accessToken) {
            setLoggedIn(true)
        } else {
            redirect(`/login?next=${pathname}`);
        }
    }, [pathname, session]);

    return (
        isLoggedIn && <>{children}</>
    )
}