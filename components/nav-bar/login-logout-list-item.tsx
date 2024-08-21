import Link from "next/link";
import {useUser} from "@auth0/nextjs-auth0/client";

export default function LoginLogoutListItem({className}) {
    const { user, isLoading } = useUser();


    return (<li className={className}>
        {!isLoading && user ? <Link className={"text-primary-foreground"} href="/api/auth/logout">Logout</Link> :
            <Link className={"text-primary-foreground"} href="/api/auth/login">Login</Link>}
    </li>)
}