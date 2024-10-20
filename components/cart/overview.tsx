"use client";

import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "@/app/icons/icons";
import { Trash2 } from "lucide-react";
import { useShoppingCart } from "@/app/hooks/use-shopping-cart";
import { useSession } from "next-auth/react";
import { useAtom } from "jotai/index";
import { eventProductAmountsAtom } from "@/app/atoms/event-product-amounts-atom";
import { getSubTotalForEventProduct } from "@/lib/utils";
import { useCallback } from "react";
import { CartItem } from "@/types/cart-item";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";

export default function CartOverview() {
    const { cart, addShoppingCartItem, removeShoppingCartItem } = useShoppingCart();
    const { data: session, status } = useSession();
    const [eventProductAmountMap, setEventProductAmountMap] = useAtom(eventProductAmountsAtom);

    const total = cart.total;

    const handleAddShoppingCartItem = (item: CartItem) => {
        const subTotal = getSubTotalForEventProduct(item.eventProductAmountId || 0, cart);
        if ((item.variant?.stockMultiplier || 0) * item.amount + subTotal > (item.eventProductAmountLeft || 0)) {
            toast({
                title: `Bestellmenge ist grösser als unser Vorrat. Überprüfe die gewählte Menge und die Menge der Produkte in deinem Warenkorb. \nWir haben insgesamt noch ${eventProductAmountMap.get(item.eventProductAmountId || 0)?.amountLeft}kg an Lager.`,
            });
        } else {
            addShoppingCartItem(item, true);
        }
    };

    return (
        <div className="max-w-screen-lg mx-auto px-4">
            <h1 className={"font-sans normal-case"}>Warenkorb</h1>
            <div className="shadow-md rounded-lg overflow-hidden">
                <div className={"mt-12"}>
                    {/* Check if cart is empty */}
                    {cart.items.length === 0 ? (
                        <p className="text-2xl text-gray-500">Der Warenkorb ist leer.</p>
                    ) : (
                        cart.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between border-b last:border-b-0">
                                <div className="flex items-center space-x-4">
                                    <div>
                                        <h2 className="font-sans text-primary-foreground text-2xl normal-case min-w-[107px]">
                                            {item.variant?.productName}
                                        </h2>
                                        <p className="text-lg text-gray-400">
                                            {item.variant?.name} {item.variant?.displayUnit.name}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                removeShoppingCartItem(item.id);
                                            }}
                                            variant="ghost"
                                            size="icon"
                                            className="w-8 h-8 rounded-full hover:bg-muted"
                                        >
                                            <MinusIcon />
                                            <span className="sr-only">Decrement</span>
                                        </Button>
                                        <span className="font-semibold text-2xl">{item.amount}</span>
                                        <Button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleAddShoppingCartItem({ ...item, amount: 1 });
                                            }}
                                            variant="ghost"
                                            size="icon"
                                            className="w-8 h-8 rounded-full hover:bg-muted"
                                        >
                                            <PlusIcon />
                                            <span className="sr-only">Increment</span>
                                        </Button>
                                    </div>
                                    <div className="text-right">
                                        <p className={"text-2xl"}>CHF {((item.variant?.price ?? 0) * item.amount).toFixed(2)}</p>
                                        <p className="text-sm text-gray-400">CHF {item.variant?.price?.toFixed(2)} pro Stück</p>
                                    </div>
                                    <Button
                                        onClick={(e) => {
                                            removeShoppingCartItem(item.id, true);
                                        }}
                                        variant="outline"
                                        size="icon"
                                        className="h-10 w-10"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {/* Show the total only if there are items in the cart */}
                {cart.items.length > 0 && (
                    <div className={"mt-12"}>
                        <div className="flex justify-between items-center">
                            <span className="text-3xl">Total</span>
                            <span className="text-3xl">CHF {total.toFixed(2)}</span>
                        </div>
                        {/* Checkout button */}
                        <div className="mt-4 flex justify-start">
                            <Link className={"w-full"} href={"/checkout"}><Button className={"text-3xl p-8 lowercase font-display w-full mt-12"} type="submit">Checkout</Button></Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
