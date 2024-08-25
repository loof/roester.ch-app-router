import {getLastRoast, getNextRoast} from "@/lib/api/events";
import Title from "@/components/overview/title";
import Overview from "@/components/overview/overview";
import TitleProvider from "@/components/overview/title-provider";
import InHowManyDays from "@/components/overview/in-how-many-days";
import DateJumbo from "@/components/overview/date-jumbo";
import AmountLeft from "@/components/overview/amount-left";
import {Button} from "@/components/ui/button";
import Link from "next/link";



export default async function RoastsPage({params}: { params: { date: string } }) {
    let roast = {}
    if (params.date === "next") {
        roast = await getNextRoast();
    } else if (params.date === "last") {
        roast = await getLastRoast();
    } else {
        // TODO: fetch by date
    }

    return (
        <main className={"container max-w-screen-lg text-center font-display flex flex-col gap-16 lowercase h-full"}>

            {roast.date &&
                <Overview>
                    <Title><TitleProvider date={params.date}/></Title>
                    <InHowManyDays classNameBigger={"text-7xl mx-3"} className={"text-5xl mx-1"} deltaDays={roast.daysToEvent}/>
                    {(params.date === "next" || params.date === "last") && <DateJumbo className={"text-primary"} date={roast.date}/>}
                    {roast.isReservationOpen && <AmountLeft className={"text-4xl"}>{roast.amountLeft} kg Vorrat</AmountLeft>}
                </Overview>}
            {!roast.date && <p>Zurzeit sind keine Röstungen geplant.</p>}

            <div className="container grid grid-cols-1 h-full md:h-auto content-end max-w-xs">
                <Button asChild variant="outline" className={"my-3 text-4xl p-8 lowercase"}><Link className={"inline-block"} href={`/roasts/${params.date}/info`}>Mehr Infos</Link></Button>

                {roast.isReservationOpen &&
                    <Button asChild className={"my-4 text-4xl p-8 lowercase"}><Link href={`/roasts/${params.date}/reserve`}>Reservieren</Link></Button>}
            </div>

            {!roast.isReservationOpen && <p className={"text-4xl"}>Reservation nicht mehr möglich</p>}
        </main>)
}
