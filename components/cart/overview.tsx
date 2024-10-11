"use client"

import {Button} from "@/components/ui/button";
import {MinusIcon, PlusIcon} from "@/app/icons/icons";
import {Trash2} from "lucide-react";
import {useShoppingCart} from "@/app/hooks/use-shopping-cart";
import {useSession} from "next-auth/react";

export default function CartOverview() {
    const {cart, addShoppingCartItem, removeShoppingCartItem} = useShoppingCart();
    const {data: session, status} = useSession()

    const total = cart.total

    return (
        <div className="max-w-screen-lg mx-auto p-4">
            <h1 className={"font-sans normal-case"}>Warenkorb</h1>
            <div className="shadow-md rounded-lg overflow-hidden">
                <div className="p-4">
                    {/* Check if cart is empty */}
                    {cart.items.length === 0 ? (
                        <p className="text-2xl text-gray-500">Der Warenkorb ist leer.</p>
                    ) : (
                        cart.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between py-4 border-b last:border-b-0">
                                <div className="flex items-center space-x-4">
                                    <div>
                                        <h2 className="font-sans text-primary-foreground text-2xl normal-case">{item.variant?.productName}</h2>
                                        <p className="text-lg text-gray-400">{item.variant?.name} {item.variant?.displayUnit.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            onClick={e => {
                                                e.preventDefault()
                                                removeShoppingCartItem(item.id)
                                            }}
                                            variant="ghost"
                                            size="icon"
                                            className="w-8 h-8 rounded-full hover:bg-muted">
                                            <MinusIcon/>
                                            <span className="sr-only">Decrement</span>
                                        </Button>
                                        <span className="font-semibold text-2xl">{item.amount}</span>
                                        <Button
                                            onClick={e => {
                                                e.preventDefault()
                                                addShoppingCartItem({...item, amount: 1})
                                            }}
                                            variant="ghost"
                                            size="icon"
                                            className="w-8 h-8 rounded-full hover:bg-muted">
                                            <PlusIcon/>
                                            <span className="sr-only">Increment</span>
                                        </Button>
                                    </div>
                                    <div className="text-right">
                                        <p className={"text-2xl"}>CHF {((item.variant?.price ?? 0) * item.amount).toFixed(2)}</p>
                                        <p className="text-sm text-gray-400">CHF {item.variant?.price?.toFixed(2)} pro Stück</p>
                                    </div>
                                    <Button onClick={e => {
                                        removeShoppingCartItem(item.id, true)
                                    }} variant="outline" size="icon" className="h-10 w-10">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {/* Show the total only if there are items in the cart */}
                {cart.items.length > 0 && (
                    <div className="p-4">
                        <div className="flex justify-between items-center">
                            <span className="text-3xl">Total</span>
                            <span className="text-3xl">CHF {total.toFixed(2)}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
