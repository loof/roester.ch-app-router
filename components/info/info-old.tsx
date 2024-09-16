import styles from "./Info.module.css"
import Link from "next/link";
import Image from 'next/image'
import {Button} from "@/components/ui/button";
import {formatDate} from "@/lib/utils";
import {v4 as uuidv4} from 'uuid';
import Properties from "@/components/properties";


export default function InfoOld({children}) {

    return (data && <>
        <main className={styles.main}>
            <Link href="#" onClick={() => {}}>
                <Button>zurück</Button>
            </Link>

            <h1>{`${data.name ? `${data.name} ` : ""}${formatDate(data.date)}`}</h1>

            {data.description && <p>{data.description && (data.description)}</p>}
            {data.eventProductAmounts.map((epa) => {
                return (<>
                    <h2 key={uuidv4()}>{epa.product.madeOf && epa.product.madeOf.length === 0 ? `100% ${epa.product.tags.find(t => {
                        return t.name === "Arabica" || t.name === "Robusta"
                    }).name} ` : ""}{epa.product.name}</h2>
                    <p>{epa.product.description}</p>

                    {epa.product.madeOf && epa.product.madeOf.length > 0 && (
                        epa.product.madeOf.map((p) => {
                            return <>
                                <h3 key={uuidv4()}>{p.amount}% {p.part.name}</h3>
                                <p>{p.part.description}</p>
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

            {isBookable && <Link href={bookingLink}><Button>Reservieren</Button></Link>}
        </main>
    </>)
}