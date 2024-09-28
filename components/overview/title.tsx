import {ReactNode} from "react";

export default function Title({children, className} : {children: ReactNode, className?: string}) {
    return <h1 className={className}>{children}</h1>;
}