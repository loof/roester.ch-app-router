import * as child_process from "node:child_process";
import {ReactNode} from "react";

export default function Description({ children, className }: { children: ReactNode, className?: string }) {
    return (
        <p className={className}>{children}</p>
    )
}