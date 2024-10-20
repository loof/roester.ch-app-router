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
import ErrorMessage from "@/components/error-message";

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
    email: z.string().email({message: "Die E-Mail Adresse ist ungültig."}),
    password: passwordSchema,
    confirmPassword: z.string(),
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
    const [errors, setErrors] = useState<{ signup?: string }>({});
    const [isLoading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const router = useRouter();
    const [authenticated, setAuthenticated] = useState(false);

    const generic_error_message = "Etwas ist schief gegangen. Versuche es erneut."

    useEffect(() => {
        if (authenticated) {
            window.location.href = "/signup/verify";
        }
    }, [authenticated]);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            const appUser = {email: data.email, password: data.password}

            const res = await fetch("/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(appUser),
            })

            if (res.ok) {
                setAuthenticated(true);
            } else {
                const errorBody = await res.json();
                setErrors((prev) => {
                    return {...prev, signup: errorBody.error}
                });
            }

        } catch (error) {
            setErrors((prev) => {
                return {...prev, signup: generic_error_message}
            });
        }
    }

    return (
        <main className="container max-w-md">
            <h1 className="font-sans normal-case">Registrieren</h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-10 mt-12">

                    {errors.signup && <ErrorMessage className={"text-2xl"}>{errors.signup}</ErrorMessage>}

                    <FormField
                        control={form.control}
                        name="email"
                        render={({field}) => (
                            <FormItem>
                                <div className="text-left">
                                    <FormLabel className="text-2xl">E-Mail Adresse <span className={"text-primary"}>*</span> </FormLabel>
                                </div>
                                <FormControl>
                                    <Input className="text-xl" placeholder="deine@email.com" {...field} />
                                </FormControl>
                                <FormMessage className="text-xl text-left"/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({field}) => (
                            <FormItem>
                                <div className="text-left">
                                    <FormLabel className="text-2xl">Passwort <span className={"text-primary"}>*</span> </FormLabel>
                                </div>
                                <FormControl>
                                    <Input className="text-xl" placeholder="Passwort"
                                           type={"password"} {...field} />
                                </FormControl>
                                <FormMessage className="text-xl text-left"/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({field}) => (
                            <FormItem>
                                <div className="text-left">
                                    <FormLabel className="text-2xl">Passwort Wiederholung<span className={"text-primary"}>*</span></FormLabel>
                                </div>
                                <FormControl>
                                    <Input className="text-xl" placeholder="Passwort"
                                           type={"password"} {...field} />
                                </FormControl>
                                <FormMessage className="text-xl text-left"/>
                            </FormItem>
                        )}
                    />

                    {errors.signup && <ErrorMessage>{errors.signup}</ErrorMessage>}
                    <Button className="text-3xl p-8 lowercase font-display" type="submit">Registrieren</Button>
                </form>
            </Form>
        </main>
    )
}
