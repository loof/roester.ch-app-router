import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

export default function MobileMenuButton({ onClick }) {
    return (
        <button className="absolute right-10 top-12" onClick={onClick}>
            <FontAwesomeIcon className="text-2xl text-primary-foreground" icon={faBars} />
        </button>
    );
}