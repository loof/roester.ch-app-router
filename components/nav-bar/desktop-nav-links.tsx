import Link from 'next/link';
import NavigationLinks from "@/components/nav-bar/navigation-links"; // Assuming NavigationLinks returns an array of links
import { clsx } from "clsx";
import { usePathname } from "next/navigation";
import LoginLogoutListItemDesktop from "@/components/nav-bar/login-logout-list-item-desktop";
import ShoppingCartIcon from "@/components/shopping-cart-icon";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function DesktopNavLinks() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isLoggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        if (session?.user?.accessToken) {
            setLoggedIn(true);
        }
    }, [pathname, session]);

    return (
        <ul className="flex flex-row space-x-6">
            {
                // Filter navigation links based on the isPrivate property
                NavigationLinks().filter(link =>
                    // Show if not private, or show if private and the user is logged in
                    !link.isPrivate || (link.isPrivate && isLoggedIn)
                ).map((link, index) => {
                    return (
                        <li key={index} className={clsx('text-xl mt-1 hover:text-primary', {
                            'text-primary': pathname.startsWith(link.href),
                            'text-primary-foreground': !pathname.startsWith(link.href)
                        })}>
                            <Link href={link.href}>{link.text}</Link>
                        </li>
                    )
                })
            }

            {
                !pathname.startsWith("/login") &&
                <LoginLogoutListItemDesktop />
            }

            <li><Link href={"/cart"}><ShoppingCartIcon /></Link></li>
        </ul>
    );
}
