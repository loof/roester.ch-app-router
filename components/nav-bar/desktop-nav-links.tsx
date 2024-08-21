import Link from 'next/link';
import NavigationLinks from "@/components/nav-bar/navigation-links";
import {clsx} from "clsx";
import {usePathname} from "next/navigation";
import {useUser} from "@auth0/nextjs-auth0/client";
import LoginLogoutListItem from "@/components/nav-bar/login-logout-list-item";

export default function DesktopNavLinks() {
    const pathname = usePathname()
    const { user, isLoading } = useUser();

    return (
        <ul className="flex flex-row space-x-6">
            {
                NavigationLinks().map((link, index) => {
                    return (
                        <li key={index} className={clsx('text-xl hover:text-primary', {
                            'text-primary': pathname.startsWith(link.href),
                            'text-primary-foreground': !pathname.startsWith(link.href)
                        })}>
                            <Link href={link.href}>{link.text}</Link>
                        </li>
                    )
                })
            }

            {
                <LoginLogoutListItem className={"text-xl"} />
            }

            {JSON.stringify(user)}

        </ul>
    );
}