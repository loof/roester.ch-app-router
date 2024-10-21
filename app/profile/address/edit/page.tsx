import ProfileAddressEditForm from "@/components/profile/profile-address-edit-form";
import {getRoastByPathVariableDate} from "@/lib/api/events";
import {Roast} from "@/types/roast";
import {AppUser} from "@/types/app-user";
import {getAppUserById} from "@/lib/api/app-user";
import {auth} from "@/auth";
import CheckAuthAndRedirect from "@/components/check-auth-and-redirect";
import {useShoppingCart} from "@/app/hooks/use-shopping-cart";


export default async function ProfileAddressEditFormPage() {
   let appUser: AppUser | null = null;  // Initialize roast as null
   let isError = false;
   const session = await auth()


   console.log(`session: ${JSON.stringify(session)}`)

   try {
      if (session?.user?.accessToken && session?.user?.userId) {
         appUser = await getAppUserById(session.user.accessToken, session.user.userId);
      } else {
         throw new Error("Invalid session data: missing accessToken or userId.");
      }
   } catch (error) {
      isError = true;
   }


   console.log(`appUser Server: ${JSON.stringify(appUser)}`);
   console.log(`isError: ${isError}`)

   return (
       <CheckAuthAndRedirect>
         <ProfileAddressEditForm appUser={appUser as AppUser}/>
       </CheckAuthAndRedirect>
   )
}
