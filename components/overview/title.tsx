import {ReactNode} from "react";

export default function Title({children, className}) {
    return <h1 className={className}>{children}</h1>;
}