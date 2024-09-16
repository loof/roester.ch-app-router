import {ReactNode} from "react";

export default function Overview({children, className}: {children: ReactNode, className?: string}) {
    return <div className={className}>{children}</div>;
}