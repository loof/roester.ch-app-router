"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {useEffect, useState} from "react";
import Link from "next/link";
import {useRouter, useSearchParams} from 'next/navigation'

const FormSchema = z.object({
    email: z.string().email({
        message: "Die E-Mail Adresse ist ungültig.",
    }),
    password: z.string().max(255, {message: "Hacker?"})

})

interface ErrorsState {
    login?: string; // login is optional
}

export default function LoginPage() {
    const [errors, setErrors] = useState<ErrorsState>({})
    const searchParams = useSearchParams()
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        if (authenticated) {
            // Redirect to previous page or home page
            window.location.href = searchParams.get("next") || "/";
        }
    }, [authenticated]);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email: data.email, password: data.password, type: "credentials"}),
            });

            if (res.ok) {
                setAuthenticated(true);
            } else {
                // handle error state here
                setErrors((prev) => {
                    return {...prev, login: "Ungültiges Login"}
                });
            }
        } catch (error) {
            setErrors((prev) => {
                return {...prev, login: "Etwas ist schief gegangen. Versuche es erneut."}
            });
        }
    }

    return (
        <main className={"container max-w-md text-center"}>
            <h1 className={"mb-10 text-6xl"}>Login</h1>
            {errors && errors.login && <h2>{errors.login}</h2>}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-10 m-10">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({field}) => (
                            <FormItem>
                                <div className={"text-left"}>
                                    <FormLabel className={"text-3xl"}>E-Mail</FormLabel>
                                    <FormMessage className={"text-xl"}/>
                                </div>

                                <FormControl>
                                    <Input className={"text-xl"} placeholder="you@email.com" {...field} />
                                </FormControl>

                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({field}) => (
                            <FormItem>
                                <div className={"text-left"}>
                                    <FormLabel className={"text-3xl"}>Passwort</FormLabel>
                                    <FormMessage className={"text-xl"}/>
                                </div>

                                <FormControl>
                                    <Input type={"password"} className={"text-xl"} {...field} />
                                </FormControl>

                            </FormItem>
                        )}
                    />
                    <Button className={"text-3xl p-8 lowercase font-display"} type="submit">Login</Button>
                    <Button className={"text-3xl p-8 lowercase font-display"} variant="outline" asChild><Link
                        href={"/signup"}>Registrieren</Link></Button>
                </form>
            </Form>


        </main>
    )
}
