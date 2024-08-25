import {formatDate} from "@/lib/utils";

export default function TitleProvider({date}) {
    if (date === "next") {
        return "Nächste Röstung"
    } else if (date === "last") {
        return "Letzte Röstung"
    } else {
        return formatDate(date)
    }
}