import { v4 as uuidv4 } from 'uuid';
import {Property} from "@/types/property";

export default function Properties({properties} : {properties: Property[]}) {
    return (
        properties.map((prop) => {return <><h4 key={uuidv4()}>{prop.name}</h4><p className={"mb-20"}
            key={uuidv4()}>{prop.description}</p></>
        })

    )
}