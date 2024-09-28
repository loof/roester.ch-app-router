import {getPrevRoast, getNextRoast} from "@/lib/api/events";
import Info from "@/components/info/info";
import BackButton from "@/components/back-button";
import {formatDate} from "@/lib/utils";
import H1 from "@/components/info/h1";
import Description from "@/components/info/description";
import {v4 as uuidv4} from 'uuid';
import Properties from "@/components/info/properties";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Roast} from "@/types/roast";


export default async function InfoPage({params}: { params: { date: string } }) {
    let roast: Roast | null = null;  // Initialize roast as null
    let isError = false;

    try {
        if (params.date === "next") {
            roast = await getNextRoast();
        } else if (params.date === "last") {
            roast = await getPrevRoast();
        } else {
            // TODO: fetch roast by specific date if applicable
            // For now, handle this case if no valid date format is provided
            isError = true;
        }
    } catch (error) {
        isError = true;  // Set error flag if any issues occur
    }

    return (
        <main className={"container max-w-screen-lg lg:px-0 items-center lg:items-start flex flex-col pb-10"}>
            <BackButton className={"mb-8 text-2xl p-6 lowercase max-w-40"}/>
            {!isError && roast && (
                <Info className={"text-center lg:text-left"}>
                    <H1>{`${roast.name ? `${roast.name} ` : ""}${formatDate(roast.date)}`}</H1>
                    <Description className={"pt-5 mb-20"}>{roast.description}</Description>
                    {roast.eventProductAmounts.map((epa) => {
                        return (
                            <div key={uuidv4()}>
                                <h2>{epa.product.madeOf && epa.product.madeOf.length === 0 ? `100% ${epa.product.tags.find(t => t.name === "Arabica" || t.name === "Robusta")?.name} ` : ""}{epa.product.name}</h2>
                                <p className={"mb-20"}>{epa.product.description}</p>

                                {epa.product.madeOf && epa.product.madeOf.length > 0 && (
                                    epa.product.madeOf.map((p) => (
                                        <div key={uuidv4()}>
                                            <h3>{p.amount}% {p.part.name}</h3>
                                            <p className={"mb-20"}>{p.part.description}</p>
                                            <Properties properties={p.part.properties}/>
                                        </div>
                                    ))
                                )}
                                {epa.product.madeOf && epa.product.madeOf.length === 0 && (
                                    <Properties properties={epa.product.properties}/>
                                )}
                            </div>
                        );
                    })}
                </Info>
            )}
            {isError && <p>Die Röstung konnte nicht geladen werden. Bitte versuche es erneut.</p>}

            {roast?.isReservationOpen && (
                <Button asChild className={"font-display my-4 text-4xl p-8 lowercase"}>
                    <Link href={`/roasts/${params.date}/reserve`}>Reservieren</Link>
                </Button>
            )}
        </main>
    );
}
