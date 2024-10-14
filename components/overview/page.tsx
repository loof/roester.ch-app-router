"use client"

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
import {useShoppingCart} from "@/app/hooks/use-shopping-cart";
import {Roast} from "@/types/roast";
import {Variant} from "@/types/variant";
import {EventProductAmount} from "@/types/event-product-amount";
import {MinusIcon, PlusIcon} from "@/app/icons/icons";
import {getSubTotalForEventProduct, roundToFiveCents} from "@/lib/utils";
import useEventCache from "@/app/hooks/use-roast-cache";

export default function OverviewPage({roast, className}: { roast: Roast, className?: string }) {
    const {cart, addShoppingCartItem, removeShoppingCartItem} = useShoppingCart();
    const {data: session, status} = useSession()
    const {variantMap, eventProductAmountMap} = useEventCache(roast)

    const formSchema = z.object({
        variantId: z.number().min(1, {message: "Bitte wähle eine Variante aus."}),
        amount: z.number().min(1, {message: "Bitte wähle eine Menge aus."}),
        price: z.number().min(0, {message: "Preis kann nicht negativ sein."}),
        eventProductAmountId: z.number().min(0, {message: "Etwas ist schief gegangen."}),
    }).superRefine((data, ctx) => {
        const variant = variantMap.get(data.variantId);
        const eventProductAmount = eventProductAmountMap.get(data.eventProductAmountId);

        if (!variant || !eventProductAmount) {
            // If either variant or eventProductAmount is undefined, add a general error.
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Etwas ist schief gegangen. Bitte überprüfe deine Eingabe.",
                path: ["variantId"], // Adjust the path if needed, you can also use "eventProductAmountId"
            });
            return; // Return early if one of the maps is undefined
        }

        const subTotal = getSubTotalForEventProduct(data.eventProductAmountId, cart);

        // Proceed only if both variant and eventProductAmount are defined
        if (variant.stockMultiplier * data.amount + subTotal > eventProductAmount.amountLeft) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Bestellmenge ist grösser als unser Vorrat.",
                path: ["amount"],
            });

            toast({
                title: `Bestellmenge ist grösser als unser Vorrat. Überprüfe die gewählte Menge und die Menge der Produkte in deinem Warenkorb. \nWir haben insgesamt noch ${eventProductAmountMap.get(data.eventProductAmountId)?.amountLeft}kg an Lager.`,
            })
        }
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        const variantId = Number(values.variantId); // Convert to number here
        addShoppingCartItem({
            id: 0,
            eventId: roast.id,
            variantId: variantId,
            amount: values.amount,
            variant: variantMap.get(variantId),
            eventProductAmountId: values.eventProductAmountId,
            eventProductAmountLeft: eventProductAmountMap.get(values.eventProductAmountId || 0)?.amountLeft
        }).then(() => {
            toast({
                title: "Auswahl wurde dem Warenkorb hinzugefügt.",
            })
        })

    }

    return (<>

        {roast.date &&
            <>
                <Overview className={className}>
                    <Title className={"font-sans normal-case"}><TitleProvider roast={roast}/></Title>
                    <InHowManyDays classNameBigger={"text-4xl mx-3"}
                                   className={"normal-case text-3xl mt-6 md:mt-12 mx-1"}
                                   deltaDays={roast.daysToEvent}/>

                    <div className={"mt-3 sm:mt-10 flex flex-wrap justify-center gap-20"}>
                        {
                            roast.eventProductAmounts.map((epa: EventProductAmount) => {
                                if (epa.product.variants.length > 0) {


                                    // eslint-disable-next-line react-hooks/rules-of-hooks
                                    const form = useForm<z.infer<typeof formSchema>>({
                                        resolver: zodResolver(formSchema),
                                        defaultValues: {
                                            variantId: epa.product.variants[0]?.id || 0,
                                            amount: 1,
                                            price: roundToFiveCents(epa.product.variants[0]?.price || 0),
                                            eventProductAmountId: undefined
                                        },
                                    })

                                    const {setValue} = form;

                                    return (
                                        <div key={uuidv4()} className={"w-full sm:w-1/2"}>
                                            <Item>
                                                <div className="p-4 grid gap-4">
                                                    <h2 className="font-sans normal-case text-4xl font-semibold">{epa.product.name}</h2>

                                                    <Varieties eventProductAmount={epa}/>
                                                    <AmountLeft className={"text-muted-foreground"}>
                                                        {epa.amountLeft} {epa.product.soldUnit?.name} Vorrat
                                                    </AmountLeft>

                                                    <Form {...form}>
                                                        <form onSubmit={form.handleSubmit(onSubmit)}
                                                              className="flex flex-col gap-y-10 mt-5">

                                                            <FormField
                                                                control={form.control}
                                                                name="variantId"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel className={"text-xl"}>wähle aus:</FormLabel>
                                                                        <FormControl>
                                                                            <ToggleGroup
                                                                                // Force the ToggleGroup to always have a selected value
                                                                                onValueChange={(e) => {
                                                                                    if (e) {  // Only change the value when a valid option is selected
                                                                                        const variant = variantMap.get(Number(e));
                                                                                        const price = variant?.price ?? 0;  // Use 0 if price is null or undefined
                                                                                        const amount = form.getValues().amount;

                                                                                        setValue("price", Number(roundToFiveCents(price * amount)));
                                                                                        setValue("variantId", Number(e));
                                                                                    }
                                                                                }}
                                                                                //defaultChecked={epa.product.variants[0].id === field.value}
                                                                                defaultValue={`${epa.product.variants[0].id}`} // Ensure default selection on initial load
                                                                                type="single"
                                                                                variant="outline"
                                                                                value={String(field.value)}
                                                                            >
                                                                                {epa.product.variants.map((v: Variant) => (
                                                                                    <ToggleGroupItem
                                                                                        className={"text-xl"}
                                                                                        key={uuidv4()}
                                                                                        value={String(v.id)}
                                                                                    >
                                                                                        {v.name}{v.displayUnit.name}
                                                                                    </ToggleGroupItem>
                                                                                ))}
                                                                            </ToggleGroup>
                                                                        </FormControl>
                                                                        <FormMessage className={"text-xl"} />
                                                                    </FormItem>
                                                                )}
                                                            />

                                                            <div className="grid gap-4">

                                                                <FormField
                                                                    defaultValue={epa.id}
                                                                    control={form.control}
                                                                    name="eventProductAmountId"
                                                                    render={({ field }) => (
                                                                        <FormItem hidden={true} defaultValue={`${epa.id}`}>
                                                                            <FormControl>
                                                                                <Input readOnly={true} value={field.value}/>
                                                                            </FormControl>
                                                                            <FormMessage className={"text-xl"} />
                                                                        </FormItem>
                                                                    )}
                                                                />


                                                                <div
                                                                    className="flex mt-10 justify-between">
                                                                    <span className="text-2xl font-bold">
                                                                        <FormField
                                                                            control={form.control}
                                                                            name="price"
                                                                            render={({field}) => (
                                                                                <FormItem>
                                                                                    {
                                                                                        field.value
                                                                                    } CHF
                                                                                    <FormMessage className={"text-xl"}/>
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    </span>

                                                                    <div className="flex gap-2">

                                                                        <FormField
                                                                            control={form.control}
                                                                            name="amount"
                                                                            render={({field}) => (

                                                                                <FormItem key={epa.id} defaultValue={""}>
                                                                                    <FormLabel>Menge</FormLabel>

                                                                                    <FormControl>
                                                                                        <div
                                                                                            className="flex gap-2 justify-end">

                                                                                            <Button
                                                                                                onClick={(event) => {
                                                                                                    event.preventDefault()
                                                                                                    const currentAmount = field.value || 0;

                                                                                                    if (currentAmount - 1 >= 1) {
                                                                                                        const variant = variantMap.get(form.getValues().variantId);

                                                                                                        if (variant && variant.price) {  // Ensure variant and price are defined
                                                                                                            setValue("price", Number(roundToFiveCents(variant.price * (currentAmount - 1))));
                                                                                                            setValue("amount", currentAmount - 1);
                                                                                                        }
                                                                                                    }


                                                                                                }} variant="ghost"
                                                                                                size="icon"
                                                                                                className="w-8 h-8 rounded-full hover:bg-muted">
                                                                                                <MinusIcon/>
                                                                                                <span
                                                                                                    className="sr-only">Decrement</span>
                                                                                            </Button>
                                                                                            <Input

                                                                                                value={field.value} // This is the amount value, managed by React Hook Form
                                                                                                onChange={(e) => {
                                                                                                    const newAmount = Number(e.target.value); // Get the new value typed by the user

                                                                                                    if (!isNaN(newAmount) && newAmount > 0) { // Ensure the new amount is valid
                                                                                                        field.onChange(newAmount); // Update the amount in the form

                                                                                                        const variant = variantMap.get(form.getValues().variantId); // Get the current selected variant

                                                                                                        if (variant && variant.price) {
                                                                                                            // Recalculate the price based on the new amount and set it
                                                                                                            setValue("price", Number(roundToFiveCents(variant.price * newAmount))); // Only update the price, avoid rerendering the input
                                                                                                        }
                                                                                                    }

                                                                                                }}
                                                                                                type="number"
                                                                                                className="w-20 px-2 py-1 text-center rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                                                                                placeholder="1"
                                                                                            />


                                                                                            <Button
                                                                                                onClick={(event) => {
                                                                                                    event.preventDefault()
                                                                                                    const currentAmount = field.value || 0;
                                                                                                    const variant = variantMap.get(form.getValues().variantId);

                                                                                                    if (variant && variant.price) {  // Ensure variant and price are defined
                                                                                                        setValue("price", Number(roundToFiveCents(variant.price * (currentAmount + 1))));
                                                                                                        setValue("amount", currentAmount + 1);
                                                                                                    }


                                                                                                }}
                                                                                                variant="ghost"
                                                                                                size="icon"
                                                                                                className="w-8 h-8 rounded-full hover:bg-muted">
                                                                                                <PlusIcon/>
                                                                                                <span
                                                                                                    className="sr-only">Increment</span>
                                                                                            </Button>


                                                                                        </div>

                                                                                    </FormControl>

                                                                                </FormItem>


                                                                            )}
                                                                        />


                                                                    </div>
                                                                </div>

                                                                <Button className={"p-6"} type="submit" size="sm">In den
                                                                    Warenkorb</Button>
                                                            </div>
                                                        </form>
                                                    </Form>

                                                </div>
                                            </Item>
                                        </div>
                                    )

                                }

                            })
                        }
                    </div>

                </Overview>
            </>}

        {!roast.isReservationOpen && <p className={"text-4xl"}>Reservation nicht mehr möglich</p>}

    </>)
}