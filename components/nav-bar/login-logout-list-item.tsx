import Link from "next/link";

export default function LoginLogoutListItem({className}) {
    const isLoading = false;
    const user = {}


    return (<li className={className}>
        {!isLoading && user ? <Link className={"text-primary-foreground"} href="/logout">Logout</Link> :
            <Link className={"text-primary-foreground"} href="/login">Login</Link>}
    </li>)
}