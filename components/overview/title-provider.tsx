import {formatDate} from "@/lib/utils";
import {Roast} from "@/types/roast";

export default function TitleProvider({roast} : {roast: Roast}) {
    if (roast.isNext === true) {
        return `Nächste Röstung ${formatDate(roast.date)}`
    } else if (roast.isPrev === true) {
        return `Letzte Röstung ${formatDate(roast.date)}`
    } else {
        return formatDate(roast.date)
    }
}