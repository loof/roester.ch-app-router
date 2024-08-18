"use client"

import {useEffect, useState} from "react";
import {getLastEvent, getNextEvent} from "@/lib/api/events";
import Overview from "@/components/overview";
import styles from "./roasts.module.css"
import {Spinner} from "@/components/spinner";
import OverviewTitle from "@/components/overview-title";

export default function Roasts({ params }: { params: { date: string } }) {
    const [data, setData] = useState({})
    const [isLoading, setLoading] = useState(true)

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

    useEffect(() => {
        if (!data) return;
        setLoading(false)
    }, [data]);

    const title = OverviewTitle(params.date)

    return (

        <main className={`${styles.main}`}>
            {isLoading && <Spinner/>}
            {!isLoading &&
                <Overview className={"flex container flex-col  text-center gap-16"} data={data}
                          title={title} showAmountLeft={true} infoLink="/roasts/next/info"
                          reserveLink="/roasts/next/reserve"/>}
        </main>)
}
