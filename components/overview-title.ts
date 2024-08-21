import {formatDate} from "@/lib/utils";

export default function OverviewTitle(title: string) {
    if (title === "next") {
        return "Nächste Röstung"
    } else if (title === "last") {
        return "Letzte Röstung"
    } else {
        return formatDate(title)
    }
}