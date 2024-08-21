"use client"

import {useEffect, useState} from "react";
import {getLastEvent, getNextEvent} from "@/lib/api/events";
import Overview from "@/components/overview";
import styles from "./info.module.css"
import {Spinner} from "@/components/spinner";
import OverviewTitle from "@/components/overview-title";
import Info from "@/components/info";


export default function InfoPage({ params }: { params: { date: string } }) {
    const [data, setData] = useState({})
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            try {
                if (params.date === "next") {
                    const new_data = await getNextEvent()
                    setData(new_data)
                    setLoading(false)
                } else if (params.date === "last") {
                    const new_data = await getLastEvent()
                    setData(new_data)
                    setLoading(false)
                }
            } catch (e) {
                alert("Die Röstung konnte nicht geladen werden. Bitte versuche es erneut.")
            }
        }
        loadData()
    }, [])


    const title = OverviewTitle(params.date)

    return (

        <>
            {!isLoading && <Info data={data} isBookable={true}/>}
            {isLoading && <Spinner/>}
        </>)
}
