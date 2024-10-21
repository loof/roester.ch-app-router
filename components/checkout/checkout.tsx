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
import {useSession} from "next-auth/react";
import CheckAuthAndRedirect from "@/components/check-auth-and-redirect";
import {usePathname} from "next/navigation";
import {getAppUserById} from "@/lib/api/app-user";
import {AppUser} from "@/types/app-user";
import {AppUserLight} from "@/types/app-user-light";
import ErrorMessage from "@/components/error-message";


export default function Checkout() {
    const { cart, addShoppingCartItem, removeShoppingCartItem } = useShoppingCart();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shippingMethod, setShippingMethod] = useState('pickup');
    const [appUser, setAppUser] = useState<AppUserLight>();
    const pathname = usePathname();
    const { data: session } = useSession();

    console.log(`session: ${JSON.stringify(session)}`);

    useEffect(() => {
        if (!session) return
        async function loadShippingAddress() {
            if (session?.user?.userId) {
                try {
                    const userData = await getAppUserById(session.user.accessToken, session.user.userId);
                    // Assuming userData contains the shipping address in a "location" field
                    setAppUser(userData);
                } catch (error) {
                    console.error("Failed to load shipping address:", error);
                }
            }
        }
        loadShippingAddress();
    }, [session]);


    const subtotal = cart.items.reduce((sum, item) => sum + (item.variant?.price ?? 0) * item.amount, 0)
    const shippingCosts = {
        letter: 1.4,
        standard: 7,
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
                <div className="grid grid-cols-1 mb-20 mt-12">

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

                            {/* Static content to display after the items */}
                            <div className="space-y-2">
                                <Separator/>
                                <div className="flex justify-between font-bold">
                                    <span className="text-2xl mt-2">Subtotal</span>
                                    <span className="text-2xl mt-2">CHF {subtotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>

                    </Card>

                    {cart.items.length > 0 && (
                        <>
                            <div
                                className={`mt-8 transition-all duration-300 ease-in-out overflow-hidden ${shippingMethod === "pickup" ? "opacity-0 max-h-0" : "opacity-100 max-h-[1000px]"}`}
                            >
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <CardTitle className="text-2xl">Lieferadresse</CardTitle>
                                        <Link className={"hover:text-primary"}
                                              href={`/profile/address/edit?next=${pathname}`}>Bearbeiten</Link>
                                    </CardHeader>
                                    <CardContent className="text-sm">
                                        <p className="text-xl">{appUser?.firstname} {appUser?.lastname}</p>
                                        <p className="text-xl">{appUser?.location.street} {appUser?.location.streetNumber}</p>
                                        <p className="text-xl">{appUser?.location.postalCode} {appUser?.location.city}</p>
                                        {appUser?.location && <p className="text-xl">Schweiz</p>}
                                        {appUser?.location &&
                                            <ErrorMessage className={"mt-5 text-primary-foreground"}>Achtung: Wir
                                                liefern nur in die Schweiz</ErrorMessage>}
                                    </CardContent>
                                </Card>
                            </div>


                            <Card className={`${shippingMethod !== 'pickup' && 'mt-8'}`}>
                                <CardHeader>
                                    <CardTitle className="text-2xl">Versandmethode</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                                        <div className="flex items-center space-x-2 mb-4">
                                            <RadioGroupItem value="letter" id="letter"/>
                                            <Label htmlFor="letter" className="text-xl">
                                                Briefpost (CHF 1.40) - 3-5 Werktage
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2 mb-4">
                                            <RadioGroupItem value="standard" id="standard"/>
                                            <Label htmlFor="standard" className="text-xl">
                                                Standardversand (CHF 7.00) - 3-5 Werktage
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="pickup" id="pickup"/>
                                            <Label htmlFor="pickup" className="text-xl">
                                                Abholung (Kostenlos): <br/>Ich kenne jemand von röster.ch und weiss, wie
                                                ich zu meinem Kaffee komme
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </CardContent>
                            </Card>
                        </>
                    )}


                    {cart.items.length > 0 && (
                        <>
                            <Card className={"mt-8"}>
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
