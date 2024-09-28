"use client"

import Link from "next/link";
import {useEffect, useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import {signOut, useSession} from "next-auth/react";

export default function LoginLogoutListItem({className} : {className?: string}) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isLoggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        if (session?.user?.accessToken) {
            setLoggedIn(true)
        }
    }, [pathname, session]);



    return (<li className={className}>
        {isLoggedIn ? <Link className={"text-primary-foreground"} href={"#"} onClick={() => signOut()}>Logout</Link> :
            <Link className={"text-primary-foreground"} href="/login">Login</Link>}
    </li>)
}