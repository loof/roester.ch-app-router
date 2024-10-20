"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {undefined, z} from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {useRouter, useSearchParams} from 'next/navigation';
import ErrorMessage from "@/components/error-message";
import {AppUser} from "@/types/app-user";
import {useEffect, useState} from "react";
import {updateAppUser} from "@/lib/api/app-user";
import {useSession} from "next-auth/react";
import App from "next/app";
import {AppUserLight} from "@/types/app-user-light";
import {useShoppingCart} from "@/app/hooks/use-shopping-cart";

// Define schema for validation
const FormSchema = z.object({
    companyName: z.string().nullable().optional(),
    firstname: z.string().min(1, { message: "Der Vorname muss angegeben werden." }),
    lastname: z.string().min(1, { message: "Der Nachname muss angegeben werden." }),
    street: z.string().min(1, { message: "Die Strasse muss angegeben werden." }),
    streetNumber: z.string().min(1, { message: "Die Hausnummer muss angegeben werden." }),
    city: z.string().min(1, { message: "Der Ort muss angegeben werden." }),
    postalCode: z.string().min(1, { message: "Die Postleitzahl muss angegeben werden" }),
});

export default function ProfileAddressEditForm({appUser, className}: { appUser: AppUser, className?: string }) {

    const [errors, setErrors] = useState<{ update?: string }>({});
    const [isLoading, setLoading] = useState(true);
    const [initialData, setInitialData] = useState(null);
    const router = useRouter();
    const generic_error_message = "Etwas ist schief gegangen. Versuche es erneut.";
    const {data: session} = useSession();
    const [isLoggedIn, setLoggedIn] = useState(false);
    const {cart, addShoppingCartItem, removeShoppingCartItem} = useShoppingCart();
    const searchParams = useSearchParams()



    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: initialData || {
            companyName: appUser?.companyName ?? "",
            firstname: appUser?.firstname ?? "",
            lastname: appUser?.lastname ?? "",
            street: appUser?.location?.street ?? "",
            streetNumber: appUser?.location?.streetNumber ?? "",
            city: appUser?.location?.city ?? "",
            postalCode: appUser?.location?.postalCode ?? "",
        },
    });



    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            const updatedUser: AppUserLight = {
                id: null,
                firstname: data.firstname,
                lastname: data.lastname,
                companyName: data.companyName || null,
                location: {
                    id: appUser?.location?.id || null,  // Add a safe check for appUser and location
                    street: data.street,
                    streetNumber: data.streetNumber,
                    city: data.city,
                    postalCode: data.postalCode,
                }
            };

            if (!session?.user) {
                throw new Error("User session is not available");
            }

            await updateAppUser(session.user.accessToken, session.user.userId, updatedUser);

            window.location.href = searchParams.get("next") || "/";

        } catch (error) {
            setErrors((prev) => ({ ...prev, update: generic_error_message }));
        }
    }



    return (
        <main className="container max-w-screen-lg">
            <h1 className="font-sans normal-case">Lieferadresse bearbeiten</h1>


            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-10 mt-12">

                    {errors.update && <ErrorMessage>{errors.update}</ErrorMessage>}

                    <FormField
                        control={form.control}
                        name="companyName"
                        render={({field}) => (
                            <FormItem>
                                <div className="text-left">
                                    <FormLabel className="text-2xl">Firmenname (Optional)</FormLabel>
                                </div>
                                <FormControl>
                                    <Input
                                        className="text-xl"
                                        placeholder="Firmenname"
                                        {...field}
                                        value={field.value ?? ""} // Handle null or undefined by defaulting to an empty string
                                    />

                                </FormControl>
                                <FormMessage className="text-xl text-left"/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="firstname"
                        render={({field}) => (
                            <FormItem>
                                <div className="text-left">
                                    <FormLabel className="text-2xl">Vorname <span className={"text-primary"}>*</span></FormLabel>
                                </div>
                                <FormControl>
                                    <Input className="text-xl" placeholder="Vorname" {...field} />
                                </FormControl>
                                <FormMessage className="text-xl text-left"/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="lastname"
                        render={({field}) => (
                            <FormItem>
                                <div className="text-left">
                                    <FormLabel className="text-2xl">Nachname <span
                                        className={"text-primary"}>*</span></FormLabel>
                                </div>
                                <FormControl>
                                    <Input className="text-xl" placeholder="Nachname" {...field} />
                                </FormControl>
                                <FormMessage className="text-xl text-left"/>
                            </FormItem>
                        )}
                    />


                    <div className="grid grid-cols-2 gap-5">
                        <FormField
                            control={form.control}
                            name="street"
                            render={({field}) => (
                                <FormItem>
                                    <div className="text-left">
                                        <FormLabel className="text-2xl">Strasse <span className={"text-primary"}>*</span></FormLabel>
                                    </div>
                                    <FormControl>
                                        <Input className="text-xl" placeholder="Strasse" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-xl text-left"/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="streetNumber"
                            render={({field}) => (
                                <FormItem>
                                    <div className="text-left">
                                        <FormLabel className="text-2xl">Hausnummer <span
                                            className={"text-primary"}>*</span></FormLabel>
                                    </div>
                                    <FormControl>
                                        <Input className="text-xl" placeholder="Hausnummer" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-xl text-left"/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <FormField
                            control={form.control}
                            name="postalCode"
                            render={({field}) => (
                                <FormItem>
                                    <div className="text-left">
                                        <FormLabel className="text-2xl">PLZ <span
                                            className={"text-primary"}>*</span></FormLabel>
                                    </div>
                                    <FormControl>
                                        <Input className="text-xl" placeholder="PLZ" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-xl text-left"/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="city"
                            render={({field}) => (
                                <FormItem>
                                    <div className="text-left">
                                        <FormLabel className="text-2xl">Ort <span
                                            className={"text-primary"}>*</span></FormLabel>
                                    </div>
                                    <FormControl>
                                        <Input className="text-xl" placeholder="Ort" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-xl text-left"/>
                                </FormItem>
                            )}
                        />
                    </div>

                    {errors.update && <ErrorMessage>{errors.update}</ErrorMessage>}

                    <Button className="text-3xl p-8 lowercase font-display" type="submit">Speichern</Button>
                </form>
            </Form>
        </main>
    );
}
