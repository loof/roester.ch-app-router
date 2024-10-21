"use client"

import {useEffect, useState} from 'react'
import {
    CreditCard,
    Truck,
    ShoppingBag,
    MapPin,
    ChevronDown,
    ChevronUp
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useShoppingCart } from "@/app/hooks/use-shopping-cart"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Link from "next/link";
import { useSession } from "next-auth/react";
import CheckAuthAndRedirect from "@/components/check-auth-and-redirect";
import {usePathname} from "next/navigation";


export default function Checkout() {
    const { cart, addShoppingCartItem, removeShoppingCartItem } = useShoppingCart();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shippingMethod, setShippingMethod] = useState('standard');
    const pathname = usePathname();


    const shippingAddress = {
        name: "Yves Peissard",
        street: "Kasparstrasse 17",
        city: "3027",
        state: "Bern",
        zip: "",
        country: "Schweiz"
    }

    const subtotal = cart.items.reduce((sum, item) => sum + (item.variant?.price ?? 0) * item.amount, 0)
    const shippingCosts = {
        standard: 7,
        express: 15,
        pickup: 0
    }
    const shippingCost = shippingCosts[shippingMethod as keyof typeof shippingCosts];
    const total = subtotal + shippingCost

    const handleOrderConfirmation = () => {
        setIsModalOpen(true);
    };

    const confirmOrder = () => {
        console.log("Order confirmed!");
        setIsModalOpen(false);
    };

    const cancelOrder = () => {
        setIsModalOpen(false);
    };

    return (

        <CheckAuthAndRedirect>
            <div className="container mx-auto px-4 max-w-screen-lg">
                <h1 className="font-sans normal-case">Bestellübersicht</h1>

                {/* Add gap between grid items */}
                <div className="grid grid-cols-1 gap-y-8 mb-20 mt-12">

                    <Card>
                        <CardContent className="mt-8">
                            {cart.items.length === 0 ? (
                                <p className="text-center text-xl">Keine Produkte im Warenkorb</p>
                            ) : (
                                cart.items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-start mb-4">
                                        <div className="flex flex-col gap-1">
                                            <h3 className="text-2xl mt-2 max-w-[300px]">{item.variant?.productName}</h3>
                                            <p className="text-xl text-muted-foreground">{item.variant?.name}</p>
                                            <p className="text-lg">Anzahl: {item.amount}</p>
                                        </div>
                                        <p className="text-2xl mt-2">CHF {((item.variant?.price ?? 0) * item.amount).toFixed(2)}</p>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {cart.items.length > 0 && (
                        <>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-2xl">Lieferadresse</CardTitle>
                                    <Link className={"hover:text-primary"}
                                          href={`/profile/address/edit?next=${pathname}`}>Bearbeiten</Link>
                                </CardHeader>
                                <CardContent className="text-sm">
                                    <p className="text-xl">{shippingAddress.street}</p>
                                    <p className="text-xl">{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}</p>
                                    <p className="text-xl">{shippingAddress.country}</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-2xl">Versandmethode</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                                        <div className="flex items-center space-x-2 mb-4">
                                            <RadioGroupItem value="standard" id="standard"/>
                                            <Label htmlFor="standard" className="text-xl">
                                                Standardversand (CHF 7.00) - 3-5 Werktage
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2 mb-4">
                                            <RadioGroupItem value="express" id="express"/>
                                            <Label htmlFor="express" className="text-xl">
                                                Expressversand (CHF 15.00) - 1-2 Werktage
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="pickup" id="pickup"/>
                                            <Label htmlFor="pickup" className="text-xl">
                                                Abholung (Kostenlos)
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </CardContent>
                            </Card>
                        </>
                    )}


                    {cart.items.length > 0 && (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-2xl">Bestellung Total</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-lg">Subtotal</span>
                                            <span>CHF {subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-lg mb-2">Versand</span>
                                            <span>CHF {shippingCost.toFixed(2)}</span>
                                        </div>
                                        <Separator/>
                                        <div className="flex justify-between font-bold">
                                            <span className="text-2xl mt-2">Total</span>
                                            <span className="text-2xl mt-2">CHF {total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full" onClick={handleOrderConfirmation}>
                                        <CreditCard className="mr-2 h-4 w-4"/>Kostenpflichtig bestellen
                                    </Button>
                                </CardFooter>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Truck className="mr-6 h-8 w-8"/>
                                        <span className="text-xl">
                                        Geschätzte Lieferzeit: {shippingMethod === 'express' ? '1-2' : '3-5'} Werktage
                                    </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="font-sans normal-case text-3xl">Bestellbestätigung</DialogTitle>
                        </DialogHeader>
                        <p className="text-2xl">Willst du wirklich kostenpflichtig bestellen?</p>
                        <DialogFooter className={"flex gap-3"}>
                            <Button className={"min-w-20"} onClick={confirmOrder}>Ja</Button>
                            <Button className={"min-w-20"} variant="outline" onClick={cancelOrder}>Nein</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </CheckAuthAndRedirect>


    )
}
