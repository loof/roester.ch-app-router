import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import {clsx} from "clsx";
import {usePathname} from "next/navigation";
import NavigationLinks from "@/components/nav-bar/navigation-links";
import LoginLogoutListItemDesktop from "@/components/nav-bar/login-logout-list-item-desktop";
import ShoppingCartIcon from "@/components/shopping-cart-icon";
import LoginLogoutListItemMobile from "@/components/nav-bar/login-logout-list-item-mobile";


export default function MobileDrawer({ isOpen, onClose } : {isOpen: boolean, onClose: () => void}) {
    const pathname = usePathname()


    return (
        <div
            className={`fixed flex flex-col pt-20 items-center z-10 top-0 right-0 h-full w-full bg-background text-black transition-transform duration-300 transform ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
            <button className="absolute right-10 top-12" onClick={onClose}>
                <FontAwesomeIcon className="text-2xl text-primary-foreground" icon={faXmark} />
            </button>
            <ul className="flex flex-col items-center space-y-4">
                {
                    NavigationLinks().map((link, index) => {
                        return (
                            <li key={index}>
                                <Link onClick={onClose} className={clsx('text-3xl hover:text-primary', {
                                    'text-primary': pathname.startsWith(link.href),
                                    'text-primary-foreground': !pathname.startsWith(link.href)
                                })} href={link.href}>{link.text}</Link>
                            </li>
                        )
                    })
                }

                <li className={"pb-7"}><Link onClick={onClose} className={clsx('text-3xl hover:text-primary', {
                    'text-primary': pathname.startsWith("/profile"),
                    'text-primary-foreground': !pathname.startsWith("/profile")
                })} href={"/profile"}>Profil</Link></li>

                <li className={"pb-7"}><Link onClick={onClose} className={clsx('text-3xl hover:text-primary', {
                    'text-primary': pathname.startsWith("/cart"),
                    'text-primary-foreground': !pathname.startsWith("/cart")
                })} href={"/cart"}>Warenkorb <ShoppingCartIcon/></Link></li>


                <LoginLogoutListItemMobile onClose={onClose}/>


            </ul>
        </div>
    );
}