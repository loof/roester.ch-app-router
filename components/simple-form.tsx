"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";
import {v4 as uuidv4} from "uuid";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

// Define the validation schema using Zod
const formSchema = z.object({
    variant: z.string().min(1, { message: "Bitte wähle eine Variante aus." }),
    amount: z.string().min(1, { message: "Bitte wähle eine Menge aus." }),
});





type FormSchemaType = z.infer<typeof formSchema>;

export default function SimpleForm() {
// 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variant: "",
            amount: "1"
        },
    })

// 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.

    }

    return (<Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
                control={form.control}
                name="variant"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Wähle aus</FormLabel>
                        <FormControl>
                            <ToggleGroup onValueChange={field.onChange} defaultValue={field.value} type="single" variant="outline">
                                <ToggleGroupItem value="320">320g</ToggleGroupItem>
                                <ToggleGroupItem value="500">500g</ToggleGroupItem>
                            </ToggleGroup>
                        </FormControl>
                        <FormDescription>
                            This is your public display name.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>


                )}
            />

            <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Wähle aus</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger className="w-20">
                                    <SelectValue placeholder="Wähle die Menge aus."/>
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value={"1"}>1</SelectItem>
                                <SelectItem value={"2"}>2</SelectItem>
                                <SelectItem value={"3"}>3</SelectItem>
                                <SelectItem value={"4"}>4</SelectItem>
                                <SelectItem value={"5"}>5</SelectItem>
                            </SelectContent>

                        </Select>

                        <FormMessage />
                    </FormItem>


                )}
            />
            <Button type="submit">Submit</Button>
        </form>
    </Form>)
}