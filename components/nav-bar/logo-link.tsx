import Link from 'next/link';
import styles from "../logo-link.module.css"
export default function LogoLink({className} : {className?: string}) {
    return (
        <div className={`${styles.div} text-center sm:mb-0 pt-10 sm:pt-0`}>
            <Link className={"text-4xl hover:text-primary"} href="/">RÖSTER.CH</Link>
        </div>
    );
}