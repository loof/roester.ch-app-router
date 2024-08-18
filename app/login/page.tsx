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
import {toast} from "@/components/ui/use-toast"
import {login} from "@/lib/api/auth";
import { useRouter } from 'next/navigation'
import {useState} from "react";
import { useSearchParams } from 'next/navigation'


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
    const url = searchParams.get('url')
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
            const resp = await login(data)
            signIn(resp)
            if (url) {
                router.push(url)
            } else {
                router.push("/")
            }
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
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </main>
    )
}
