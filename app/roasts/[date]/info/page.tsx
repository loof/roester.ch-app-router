import {getPrevRoast, getNextRoast, getRoastByDate} from "@/lib/api/events";
import Info from "@/components/info/info";
import {formatDate} from "@/lib/utils";
import H1 from "@/components/info/h1";
import Description from "@/components/info/description";
import {v4 as uuidv4} from 'uuid';
import Properties from "@/components/info/properties";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Roast} from "@/types/roast";

export default async function InfoPage({params}: { params: { date: string } }) {
    let roast : Roast
    if (params.date === "next") {
        roast = await getNextRoast();
    } else if (params.date === "last") {
        roast = await getPrevRoast();
    } else {
        roast = await getRoastByDate(params.date);
    }

    return (

        <main className={"container max-w-screen-lg lg:px-0 items-center lg:items-start flex flex-col pb-10"}>
           {/* <BackButton className={"mb-8 text-2xl p-6 lowercase max-w-40"}/>*/}
            <Info className={"text-center lg:text-left"}>
                <H1>{`${roast.name ? `${roast.name} ` : ""}${formatDate(roast.date)}`}</H1>
                <Description className={"pt-5 mb-20"}>{roast.description}</Description>
                {roast.eventProductAmounts.map((epa) => {
                    return (<>
                        <h2 key={uuidv4()}>{epa.product.madeOf && epa.product.madeOf.length === 0 ? `100% ${epa.product.tags.find(t => {
                            return t.name === "Arabica" || t.name === "Robusta"
                        })?.name} ` : ""}{epa.product.name}</h2>
                        <p className={"mb-20"}>{epa.product.description}</p>

                        {epa.product.madeOf && epa.product.madeOf.length > 0 && (
                            epa.product.madeOf.map((p) => {
                                return <>
                                    <h3 key={uuidv4()}>{p.amount}% {p.part.name}</h3>
                                    <p className={"mb-20"}>{p.part.description}</p>
                                    {
                                        <Properties properties={p.part.properties}/>
                                    }
                                </>
                            })
                        )}
                        {epa.product.madeOf && epa.product.madeOf.length === 0 && (
                            <Properties properties={epa.product.properties}/>
                        )}
                    </>)
                })}
            </Info>

            {roast.isReservationOpen &&
                <Button asChild className={"font-display my-4 text-4xl p-8 lowercase"}><Link href={`/roasts/${params.date}/reserve`}>Reservieren</Link></Button>}

        </main>)
}
