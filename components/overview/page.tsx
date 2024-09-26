"use client"

import { useAtom } from 'jotai'
import Overview from "@/components/overview/overview";
import Title from "@/components/overview/title";
import TitleProvider from "@/components/overview/title-provider";
import InHowManyDays from "@/components/overview/in-how-many-days";
import DateJumbo from "@/components/overview/date-jumbo";
import AmountLeft from "@/components/overview/amount-left";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import Item from "@/components/roasts/shop/item";
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
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
import {useSession} from "next-auth/react";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";
import Varieties from "@/components/overview/varieties";
import {v4 as uuidv4} from 'uuid';
import {toast} from "@/components/ui/use-toast";
import {cartAtom} from "@/app/atoms/shopping-cart-atom";
import {useShoppingCart} from "@/app/hooks/use-shopping-cart";
import {CartItem} from "@/types/cart-item";
import {session} from "@auth/core/lib/actions";
import {Variant} from "@/types/variant";
import {DisplayUnit} from "@/types/display-unit";
import {Roast} from "@/types/roast";
import {getVariantById} from "@/lib/api/variants";


const formSchema = z.object({
    variantId: z.number().min(1, { message: "Bitte wähle eine Variante aus." }),
    amount: z.number().min(1, { message: "Bitte wähle eine Menge aus." }),
});

function MinusIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
        </svg>
    )
}


function PlusIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    )
}

type formSchemaType = z.infer<typeof formSchema>;

export default function OverviewPage({roast, className}) {
    const {cart, addShoppingCartItem, removeShoppingCartItem} = useShoppingCart();

    const { data: session, status } = useSession()

    function onSubmit(values: z.infer<typeof formSchema>) {

        getVariantById(values.variantId).then(dbVariant => {
            addShoppingCartItem({
                id: 0,
                eventId: roast.id,
                variantId: dbVariant.id,
                amount: values.amount,
                variant: dbVariant
            }).then(() => {
                toast({
                    title: "Auswahl wurde dem Warenkorb hinzugefügt.",
                })
            })
        })
    }


    return (<>

        {roast.date &&
            <>
                <Overview className={className}>
                    <Title className={"font-sans normal-case"}><TitleProvider roast={roast}/></Title>
                    <InHowManyDays classNameBigger={"text-4xl mx-3"} className={"normal-case text-3xl mt-6 md:mt-12 mx-1"}
                                   deltaDays={roast.daysToEvent}/>

                    <div className={"mt-3 sm:mt-10 flex flex-wrap justify-center gap-20"}>
                        {
                            roast.eventProductAmounts.map((epa) => {

                                // eslint-disable-next-line react-hooks/rules-of-hooks
                                const form = useForm<z.infer<typeof formSchema>>({
                                    resolver: zodResolver(formSchema),
                                    defaultValues: {
                                        variantId: 0,
                                        amount: 1
                                    },
                                })

                                const {setValue} = form;

                                return (
                                    <div key={uuidv4()}>
                                    <Item >
                                        <div className="p-4 grid gap-4">
                                            <h2 className="font-sans normal-case text-4xl font-semibold">{epa.product.name}</h2>

                                            <Varieties eventProductAmount={epa}/>
                                            <AmountLeft className={"text-muted-foreground"}>
                                                {epa.amountLeft} {epa.product.soldUnit.name} Vorrat
                                            </AmountLeft>

                                            <Form {...form}>
                                                <form onSubmit={form.handleSubmit(onSubmit)}
                                                      className="flex flex-col gap-y-10 mt-5">

                                                    <div className="grid gap-4">

                                                        <FormField
                                                            control={form.control}
                                                            name="variantId"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel className={"text-xl"}>wähle aus:</FormLabel>
                                                                    <FormControl>
                                                                        <ToggleGroup onValueChange={(e) => {
                                                                            field.onChange(e)}

                                                                        } defaultValue={field.value} type="single" variant="outline">
                                                                            {epa.product.variants.map((v) => {
                                                                                return <ToggleGroupItem className={"text-xl"} key={uuidv4()}
                                                                                                        value={v.id}>{v.name}{v.displayUnit.name}</ToggleGroupItem>
                                                                            })}
                                                                        </ToggleGroup>
                                                                    </FormControl>
                                                                    <FormMessage className={"text-xl"} />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <div className="flex mt-10 items-center justify-between">
                                                            <span className="text-2xl font-bold">$79.99</span>
                                                            <div className="flex items-center gap-2">

                                                                <FormField
                                                                    control={form.control}
                                                                    name="amount"
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                            <FormLabel>Menge</FormLabel>

                                                                                <FormControl>
                                                                                    <div
                                                                                        className="flex items-center gap-2">
                                                                                        <Button onClick={(event) => {
                                                                                            event.preventDefault()
                                                                                            if (parseInt(field.value) - 1 >= 1) {
                                                                                                setValue("amount", parseInt(field.value) - 1)
                                                                                            }

                                                                                        }} variant="ghost"
                                                                                                size="icon"
                                                                                                className="w-8 h-8 rounded-full hover:bg-muted">
                                                                                            <MinusIcon />
                                                                                            <span
                                                                                                className="sr-only">Decrement</span>
                                                                                        </Button>
                                                                                        <Input
                                                                                            value={field.value}
                                                                                            onInput={field.onChange}
                                                                                            onChange={field.onChange}
                                                                                            type="number"
                                                                                            className="w-20 px-2 py-1 text-center rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                                                                            placeholder="1"
                                                                                        />
                                                                                        <Button onClick={(event) => {
                                                                                            event.preventDefault()
                                                                                            setValue("amount", parseInt(field.value) + 1)

                                                                                        }}
                                                                                            variant="ghost"
                                                                                                size="icon"
                                                                                                className="w-8 h-8 rounded-full hover:bg-muted">
                                                                                            <PlusIcon />
                                                                                            <span
                                                                                                className="sr-only">Increment</span>
                                                                                        </Button>
                                                                                    </div>
                                                                                </FormControl>




                                                                            <FormMessage/>
                                                                        </FormItem>


                                                                    )}
                                                                />


                                                            </div>
                                                        </div>

                                                        <Button className={"p-6"} type="submit" size="sm">In den Warenkorb</Button>
                                                    </div>
                                                </form>
                                            </Form>

                                        </div>
                                    </Item>
                                    </div>
                                )
                            })
                        }
                    </div>

                </Overview>
            </>}

        {!roast.isReservationOpen && <p className={"text-4xl"}>Reservation nicht mehr möglich</p>}

    </>)
}