"use client"

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Button} from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useRouter} from 'next/navigation';
import {useEffect, useState} from "react";
import {useSearchParams} from 'next/navigation';
import {login, signup} from "@/lib/api/auth";
import {createAppUser} from "@/lib/api/app-user";

const passwordSchema = z
    .string()
    .min(8, {message: "Das Passwort muss mindestens 8 Zeichen beinhalten."})
    .max(255, {message: "Das Passwort darf maximal 255 Zeichen beinhalten."})
    .refine((password) => /[A-Z]/.test(password), {
        message: "Das Passwort muss ein Grossbuchstabe beinhalten.",
    })
    .refine((password) => /[a-z]/.test(password), {
        message: "Das Passwort muss ein Kleinbuchstabe beinhalten.",
    })
    .refine((password) => /[0-9]/.test(password), {message: "Das Passwort muss eine Zahl beinhalten."})
    .refine((password) => /[!@#$%^&*]/.test(password), {
        message: "Das Passwort muss ein Sonderzeichen beinhalten.",
    });

const FormSchema = z.object({
    companyName: z.string(),
    firstname: z.string().min(1, {message: "Der Vorname muss angegeben werden."}),
    lastname: z.string().min(1, {message: "Der Nachname muss angegeben werden."}),
    street: z.string().min(1, {message: "Die Strasse muss angegeben werden."}),
    streetNumber: z.string().min(1, {message: "Die Hausnummer muss angegeben werden."}),
    city: z.string().min(1, {message: "Der Ort muss angegeben werden."}),
    postalCode: z.string().min(1, {message: "Die Postleitzahl muss angegeben werden"}),
    email: z.string().email({
        message: "Die E-Mail Adresse ist ungültig.",
    }),
    password: passwordSchema,
    confirmPassword: z.string()
}).superRefine(({confirmPassword, password}, ctx) => {
    if (confirmPassword !== password) {
        ctx.addIssue({
            code: "custom",
            message: "Die Passwörter stimmen nicht überein.",
            path: ['confirmPassword'],
        });
    }
});

export default function SignUpPage() {
    const [errors, setErrors] = useState<{ signup?: string }>({}); // Treat errors as an object
    const [isLoading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const url = searchParams.get('url');
    const router = useRouter();
    const [authenticated, setAuthenticated] = useState(false);

    const generic_error_message = "Etwas ist schief gegangen. Versuche es erneut."

    useEffect(() => {
        if (authenticated) {
            // Redirect to previous page or home page
            window.location.href = searchParams.get("next") || "/";
        }
    }, [authenticated]);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            companyName: "",
            firstname: "",
            lastname: "",
            street: "",
            streetNr: "",
            city: "",
            postalCode: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(data: z.infer<typeof FormSchema>) {

        try {
            const appUser = await createAppUser(
                data.firstname,
                data.lastname,
                data.street,
                data.streetNumber,
                data.city,
                data.postalCode,
                data.email,
                data.password,
                null,
                data.companyName
            );

            const res = await fetch("/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(appUser),
            });

            if (res.ok) {
                setAuthenticated(true);
            } else {
                // handle error state here
                setErrors((prev) => {
                    return {...prev, signup: "Ungültiges Login"}
                });
            }

        } catch (error) {
            setErrors((prev) => {
                return {...prev, signup: generic_error_message}
            });
        }

    }

    return (
        <main className="container max-w-screen-lg text-center">
            <h1 className="mb-10 text-6xl">Registrieren</h1>
            {errors.signup && <p >{errors.signup}</p>} {/* Render error message if present */}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-10 m-10">

                    <FormField
                        control={form.control}
                        name="firstname"
                        render={({field}) => (
                            <FormItem>
                                <div className="text-left">
                                    <FormLabel className="text-2xl">Vorname</FormLabel>
                                    <FormMessage className="text-xl"/>
                                </div>
                                <FormControl>
                                    <Input className="text-xl" placeholder="Vorname" {...field} />
                                </FormControl>
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
                                    <FormMessage className="text-xl"/>
                                </div>
                                <FormControl>
                                    <Input className="text-xl" placeholder="Vorname" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({field}) => (
                            <FormItem>
                                <div className="text-left">
                                    <FormLabel className="text-2xl">E-Mail Adresse</FormLabel>
                                    <FormMessage className="text-xl"/>
                                </div>
                                <FormControl>
                                    <Input className="text-xl" placeholder="deine@email.com" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                        <FormField
                            control={form.control}
                            name="street"
                            render={({field}) => (
                                <FormItem>
                                    <div className="text-left">
                                        <FormLabel className="text-2xl">Strasse</FormLabel>
                                        <FormMessage className="text-xl"/>
                                    </div>
                                    <FormControl>
                                        <Input className="text-xl" placeholder="Strasse" {...field} />
                                    </FormControl>
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
                                        <FormMessage className="text-xl"/>
                                    </div>
                                    <FormControl>
                                        <Input className="text-xl" placeholder="Hausnummer" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                    <FormField
                        control={form.control}
                        name="postalCode"
                        render={({field}) => (
                            <FormItem>
                                <div className="text-left">
                                    <FormLabel className="text-2xl">PLZ</FormLabel>
                                    <FormMessage className="text-xl"/>
                                </div>
                                <FormControl>
                                    <Input className="text-xl" placeholder="PLZ" {...field} />
                                </FormControl>
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
                                    <FormMessage className="text-xl"/>
                                </div>
                                <FormControl>
                                    <Input className="text-xl" placeholder="Ort" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({field}) => (
                            <FormItem>
                                <div className="text-left">
                                    <FormLabel className="text-2xl">Passwort</FormLabel>
                                    <FormMessage className="text-xl"/>
                                </div>
                                <FormControl>
                                    <Input className="text-xl" placeholder="Passwort" type={"password"} {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({field}) => (
                            <FormItem>
                                <div className="text-left">
                                    <FormLabel className="text-2xl">Passwort Wiederholung</FormLabel>
                                    <FormMessage className="text-xl"/>
                                </div>
                                <FormControl>
                                    <Input className="text-xl" placeholder="Passwort" type={"password"} {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* Repeat for other form fields */}
                    <Button className="text-3xl p-8 lowercase font-display" type="submit">Registrieren</Button>
                </form>
            </Form>
        </main>
    )
}