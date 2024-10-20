import ProfileAddressEditForm from "@/components/profile/profile-address-edit-form";
import {getRoastByPathVariableDate} from "@/lib/api/events";
import {Roast} from "@/types/roast";
import {AppUser} from "@/types/app-user";
import {getAppUserById} from "@/lib/api/app-user";
import {auth} from "@/auth";


export default async function ProfileAddressEditFormPage() {
   let appUser: AppUser | null = null;  // Initialize roast as null
   let isError = false;
   const session = await auth()

   console.log(`session: ${JSON.stringify(session)}`)

   try {
      appUser = await getAppUserById(session?.user?.accessToken, session?.user?.userId);
   } catch (error) {
      isError = true;
   }

   console.log(`appUser Server: ${appUser}`)
   console.log(`isError: ${isError}`)

   return (<ProfileAddressEditForm appUser={appUser as AppUser}/>)
}
