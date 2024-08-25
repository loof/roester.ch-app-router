"use client"

import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useRouter} from 'next/navigation'

export default function BackButton({className}) {
    const router = useRouter()
    return (
        <Button className={className} asChild><Link href="#" onClick={() => {
            router.back()
        }}>Zurück</Link></Button>
    )
}