"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {Button} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {useState} from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from 'next/navigation'
import {signIn} from "next-auth/react";
import {onFormSubmit} from "@/app/login/_actions/actions";

const FormSchema = z.object({
    email: z.string().email({
        message: "Die E-Mail Adresse ist ungültig.",
    }),
    password: z.string().max(255, {message: "Hacker?"})

})

export default function LoginPage() {
    const [errors, setErrors] = useState([])
    const [model, setModel] = useState({})
    const [isLoading, setLoading] = useState(true)
    const searchParams = useSearchParams()
    const redirectUrl = searchParams.get('redirect')
    const router = useRouter()


    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            console.log(data)
            await onFormSubmit(data)
            router.replace(redirectUrl || '/')
        } catch (e) {
            setErrors({
                ...errors,
                login: "Login fehlgeschlagen"
            })
            setLoading(false)
        }
    }

    return (
        <main className={"container max-w-md text-center"}>
            <h1 className={"mb-10 text-6xl"}>Login</h1>
            {errors && errors.length > 0 && <h2>{errors.login}</h2>}
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
                    <Button className={"text-3xl p-8 lowercase font-display"} variant="outline"  asChild><Link href={"/signup"}>Registrieren</Link></Button>
                </form>
            </Form>


        </main>
    )
}
