"use server"
import OverviewPage from "@/components/overview/page";
import {getRoastByDate, getRoastByPathVariableDate} from "@/lib/api/events";


export default async function RoastsPage({params}: { params: { date: string } }) {
    let roast = null;
    let isError = false;
    try {
        roast = await getRoastByPathVariableDate(params.date)
    } catch (error) {
        isError = true
    }

    return (
        <main className={"container max-w-screen-lg text-center font-display flex flex-col gap-16 lowercase h-full"}>

            {!isError && <OverviewPage roast={roast} date={params.date} />}

            {isError && <><h1>Fehler</h1><p>Die Daten konnten nicht geladen Werden. <br/>Versuche es nochmals.</p></>}

        </main>)
}
