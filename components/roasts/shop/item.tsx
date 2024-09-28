"use client"
import Image from "next/image";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {ReactNode} from "react";

export default function Item({children, className} : {children: ReactNode, className?: string}) {
    return (<div className={className}>{children}</div>)
}