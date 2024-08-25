import {ReactNode} from "react";
import {formatDate} from "@/lib/utils";

export default function H1({children, className}: {children: ReactNode, className?: string}) {
    return (<><h1 className={className}>{children}</h1></>)
}