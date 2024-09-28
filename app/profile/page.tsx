import CheckAuthAndRedirect from "@/components/check-auth-and-redirect";
import {useSession} from "next-auth/react";


export default function ProfilePage() {
    return (<>
        <CheckAuthAndRedirect>
            <main className={"container max-w-screen-lg text-center font-display gap-16 lowercase"}>
                Hallo eingeloggter User
            </main>
        </CheckAuthAndRedirect></>)
}
