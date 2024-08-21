"use client"

import {useEffect, useState} from "react";
import {getLastEvent, getNextEvent} from "@/lib/api/events";
import Overview from "@/components/overview";
import styles from "./roasts.module.css"
import {Spinner} from "@/components/spinner";
import OverviewTitle from "@/components/overview-title";
import {useUser} from "@auth0/nextjs-auth0/client";
import {usePathname} from "next/navigation";

export default function Roasts({ params }: { params: { date: string } }) {
    const [data, setData] = useState({})
    const { user, isLoading } = useUser();
    const pathname = usePathname()

    useEffect(() => {
        const loadData = async () => {
            try {
                if (params.date === "next") {
                    setData(await getNextEvent())
                } else if (params.date === "last") {
                    setData(await getLastEvent())
                }
            } catch (e) {
                alert("Die Röstung konnte nicht geladen werden. Bitte versuche es erneut.")
            }
        }
        loadData()
    }, [])


    const title = OverviewTitle(params.date)

    return (

        <main className={`${styles.main}`}>
            {isLoading && <Spinner/>}
            {!isLoading &&
                <Overview className={"flex container flex-col  text-center gap-16"} data={data}
                          title={title} showAmountLeft={true} infoLink={`${pathname}/info`}
                          reserveLink={`${pathname}/reserve`}/>}


        </main>)
}
