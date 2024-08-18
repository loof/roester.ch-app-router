"use client"

import Link from "next/link";
import DiffDays from "@/components/diff-days";
import AmountLeft from "@/components/amount-left";
import {Button} from "@/components/ui/button";
import {formatDate} from "@/lib/utils";

export default function Overview({
                                     title,
                                     className,
                                     data,
                                     showAmountLeft = false,
                                     infoLink,
                                     reserveLink
                                 }) {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date(data && data.id ? data.date : null);
    const secondDate = new Date();
    const diffDays = Math.round((firstDate - secondDate) / oneDay);
    const isClosed = data && diffDays <= data.daysBeforeSubscriptionCloses
    const isBookable = !isClosed && diffDays > 0;
    const prefix = diffDays > 0 ? "in" : "war vor"

    return (<>


            {data.id && data.id > 0 && <>

                <article className={className}>
                    <h1 className={"text-6xl"}>{title}</h1>
                    <DiffDays className="text-4xl" prefix={prefix} data={data}/>
                    <p className="text-7xl">
                        <time dateTime={data.date}>{formatDate(data.date)}</time>
                    </p>
                    {(data.eventProductAmounts && data.eventProductAmounts.length > 0) && <>

                        {showAmountLeft && <AmountLeft className={"text-5xl"} event={data}/>}
                    </>


                    }

                    <div className="flex container max-w-min flex-col">
                        <Button variant="outline" className={"my-3 text-4xl p-8 lowercase"}><Link href={infoLink}>Mehr Infos</Link></Button>

                        {isBookable && !isClosed &&
                            <Button className={"my-3 text-4xl p-8 lowercase"}><Link href={reserveLink}>Reservieren</Link></Button>}
                    </div>

                    {isClosed && <p className={"text-4xl"}>Reservation nicht mehr möglich</p>}

                </article>


            </>}

            {data && data.id === null && <p>Zurzeit sind keine Röstungen geplant.</p>}


    </>)

}