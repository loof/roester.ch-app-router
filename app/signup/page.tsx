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
import {useState} from "react";
import {useSearchParams} from 'next/navigation';
import {login} from "@/lib/api/auth";

const passwordSchema = z
    .string()
    .min(8, { message: "Das Passwort muss mindestens 8 Zeichen beinhalten." })
    .max(255, { message: "Das Passwort darf maximal 255 Zeichen beinhalten." })
    .refine((password) => /[A-Z]/.test(password), {
        message: "Das Passwort muss ein Grossbuchstabe beinhalten.",
    })
    .refine((password) => /[a-z]/.test(password), {
        message: "Das Passwort muss ein Kleinbuchstabe beinhalten.",
    })
    .refine((password) => /[0-9]/.test(password), { message: "Das Passwort muss eine Zahl beinhalten." })
    .refine((password) => /[!@#$%^&*]/.test(password), {
        message: "Das Passwort muss ein Sonderzeichen beinhalten.",
    });

const FormSchema = z.object({
    firstname: z.string().min(1, { message: "Der Vorname muss angegeben werden." }),
    surname: z.string().min(1, { message: "Der Nachname muss angegeben werden." }),
    address: z.string().min(1, { message: "Die Strasse muss angegeben werden." }),
    streetNr: z.string().min(1, { message: "Die Hausnummer muss angegeben werden." }),
    email: z.string().email({
        message: "Die E-Mail Adresse ist ungültig.",
    }),
    password: passwordSchema,
    confirmPassword: z.string()
}).superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
        ctx.addIssue({
            code: "custom",
            message: "Die Passwörter stimmen nicht überein.",
            path: ['confirmPassword'],
        });
    }
});

export default function SignUpPage() {
    const [errors, setErrors] = useState<{login?: string}>({}); // Treat errors as an object
    const [isLoading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const url = searchParams.get('url');
    const router = useRouter();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            firstname: "",
            surname: "",
            address: "",
            streetNr: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            const resp = await login(data);
            // signIn(resp)
            if (url) {
                router.push(url);
            } else {
                router.push("/");
            }
        } catch (e) {
            setErrors({ login: "Login fehlgeschlagen" });
            setLoading(false);
        }
    }

    return (
        <main className="container max-w-screen-lg text-center">
            <h1 className="mb-10 text-6xl">Registrieren</h1>
            {errors.login && <h2>{errors.login}</h2>} {/* Render error message if present */}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-10 m-10">
                    <FormField
                        control={form.control}
                        name="firstname"
                        render={({ field }) => (
                            <FormItem>
                                <div className="text-left">
                                    <FormLabel className="text-2xl">Vorname</FormLabel>
                                    <FormMessage className="text-xl" />
                                </div>
                                <FormControl>
                                    <Input className="text-xl" placeholder="Vorname" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    {/* Repeat for other form fields */}
                    <Button className="text-3xl p-8 lowercase font-display" type="submit">Registrieren</Button>
                </form>
            </Form>
        </main>
    );
}
