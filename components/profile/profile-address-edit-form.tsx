"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import ErrorMessage from "@/components/error-message";

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

export default function ProfileAddressEditForm({ userId }: { userId: string }) {
    const [errors, setErrors] = useState<{ update?: string }>({});
    const [isLoading, setLoading] = useState(true);
    const [initialData, setInitialData] = useState(null);
    const router = useRouter();
    const generic_error_message = "Etwas ist schief gegangen. Versuche es erneut.";

    useEffect(() => {
        async function fetchData() {
            try {
                //const userData = await getAppUser(userId);
                //setInitialData(userData); // Populate form with existing data
                setLoading(false);
            } catch (error) {
                setErrors({ update: generic_error_message });
            }
        }
        fetchData();
    }, [userId]);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        mode: "onChange",         // Validate on submit
        reValidateMode: "onBlur", // Revalidate when a field is blurred
        defaultValues: initialData || {
            companyName: "",
            firstname: "",
            lastname: "",
            street: "",
            streetNumber: "",
            city: "",
            postalCode: "",
        },
    });


    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            const updatedUser = {
                firstname: data.firstname,
                lastname: data.lastname,
                street: data.street,
                streetNumber: data.streetNumber,
                city: data.city,
                postalCode: data.postalCode,
                companyName: data.companyName || null,
            };

            //const res = await updateAppUser(userId, updatedUser);

            /*if (res.ok) {
                router.push("/profile");
            } else {
                const errorBody = await res.json();
                setErrors((prev) => ({ ...prev, update: errorBody.error }));
            }*/
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
                                    <Input className="text-xl" placeholder="Firmenname" {...field} />
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
                                    <FormLabel className="text-2xl">Vorname</FormLabel>
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
                                    <FormLabel className="text-2xl">Nachname</FormLabel>
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
                                        <FormLabel className="text-2xl">Strasse</FormLabel>
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
                                        <FormLabel className="text-2xl">Hausnummer</FormLabel>
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
                                        <FormLabel className="text-2xl">PLZ</FormLabel>
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
                                        <FormLabel className="text-2xl">Ort</FormLabel>
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