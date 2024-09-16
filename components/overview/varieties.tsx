

import {v4 as uuidv4} from 'uuid';

export default function Varieties({eventProductAmount, className}) {

    return (
        eventProductAmount && <><p>{eventProductAmount.product.madeOf && eventProductAmount.product.madeOf.length === 0 ? `100% ${eventProductAmount.product.tags.find(t => {
                        return t.name === "Arabica" || t.name === "Robusta"
                    }).name} ` : ""}</p>

            {
                eventProductAmount.product.madeOf && eventProductAmount.product.madeOf.length > 0 &&
                    eventProductAmount.product.madeOf.map((p) => {
                        return (<p key={uuidv4()}>{p.amount}% {p.part.tags.find(t => {return t.name === "Arabica" || t.name === "Robusta"}).name}<br/></p>)
                        })
            }



        </>
    )

}