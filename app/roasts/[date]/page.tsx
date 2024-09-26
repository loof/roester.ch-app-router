
import {getRoastByPathVariableDate} from "@/lib/api/events";
import OverviewPage from "@/components/overview/page";
import {Roast} from "@/types/roast";



export default async function RoastsShopPagePage({params}: { params: { date: string } }) {
    let roast : Roast;
    let isError = false;
    try {
        roast = await getRoastByPathVariableDate(params.date)
    } catch (error) {
        isError = true
    }


    return (
        <main className={"container max-w-screen-lg text-center"}>
            {!isError && <OverviewPage roast={roast}/>}
            {isError && <p>Es wurde keine Röstung gefunden.</p>}
        </main>
)
}
