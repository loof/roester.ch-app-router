
import {getRoastByPathVariableDate} from "@/lib/api/events";
import OverviewPage from "@/components/overview/page";



export default async function RoastsShopPagePage({params}: { params: { date: string } }) {
    let roast = null;
    let isError = false;
    try {
        roast = await getRoastByPathVariableDate(params.date)
    } catch (error) {
        isError = true
    }


    return (
        <main className={"container max-w-screen-lg text-center"}>
            {!isError && <OverviewPage className={"mt-16"} roast={roast}/>}
            {isError && <p>Es wurde keine Röstung gefunden.</p>}
        </main>
)
}
