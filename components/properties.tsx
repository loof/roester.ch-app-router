"use client"

import { v4 as uuidv4 } from 'uuid';

export default function Properties({properties}) {
    return (
        properties.map((prop) => {return <><h4 key={uuidv4()}>{prop.name}</h4><p
            key={uuidv4()}>{prop.description}</p></>
        })

    )
}