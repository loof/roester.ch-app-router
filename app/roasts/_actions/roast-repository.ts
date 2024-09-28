
import {getPrevRoast, getNextRoast, getRoastByDate} from "@/lib/api/events";

export async function getByDate({date}: { date: string }) {
    let roast = null
    if (date === "next") {
        roast = await getNextRoast();
    } else if (date === "prev") {
        roast = await getPrevRoast();
    } else {
        roast = await getRoastByDate(date)
    }

    return roast
}