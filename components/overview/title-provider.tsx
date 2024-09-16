import {formatDate} from "@/lib/utils";

export default function TitleProvider({roast}) {
    if (roast.isNext === true) {
        return `Nächste Röstung ${formatDate(roast.date)}`
    } else if (roast.isPrev === true) {
        return `Letzte Röstung ${formatDate(roast.date)}`
    } else {
        return formatDate(roast.date)
    }
}