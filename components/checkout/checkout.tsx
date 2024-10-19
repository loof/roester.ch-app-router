"use client"

import {useState} from 'react'
import {
    CreditCard,
    Truck,
    ShoppingBag,
    MapPin,
    ChevronDown,
    ChevronUp
} from 'lucide-react'
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Separator} from "@/components/ui/separator"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion"

export default function Checkout() {
    const [isAddressExpanded, setIsAddressExpanded] = useState(false)

    // This would typically come from your application's state or API
    const cartItems = [
        {id: 1, name: "Rohkaffee Bio & Fair: Tansania Robusta", variant: "320g", price: 29.99, quantity: 2},
        {id: 2, name: "Herbströstung 2024", variant: "560g", price: 59.99, quantity: 1},
    ]

    const shippingAddress = {
        name: "Yves Peissard",
        street: "Kasparstrasse 17",
        city: "3027",
        state: "Bern",
        zip: "",
        country: "Schweiz"
    }

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shippingCost = 5.99
    const tax = subtotal * 0.08 // Assuming 8% tax rate
    const total = subtotal + shippingCost + tax

    return (
        <div className="container mx-auto px-4 max-w-screen-lg">
            <h1 className="font-sans normal-case">Bestellübersicht</h1>

            <div className="grid gap-8 md:grid-cols-3 mt-12">
                <div className="md:col-span-2">
                    <Card>
                        <CardContent className={"mt-8"}>
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex justify-between items-start mb-4">
                                    <div className={"flex flex-col gap-1"}>
                                        <h3 className={"text-2xl mt-2 max-w-[300px]"}>{item.name}</h3>
                                        <p className="text-xl text-muted-foreground">{item.variant}</p>
                                        <p className="text-lg">Anzahl: {item.quantity}</p>
                                    </div>
                                    <p className={"text-2xl"}>CHF {(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className={"mt-12"}>
                        <CardHeader>
                            <CardTitle className="text-2xl">Lieferadresse</CardTitle>
                        </CardHeader>
                        <CardContent className={"text-sm"}>


                            {/*<div className="flex items-center">
                                <MapPin className="mr-2 h-4 w-4"/>
                                {shippingAddress.name}, {shippingAddress.city}
                            </div>*/}

                            <p className={"text-xl"}>{shippingAddress.street}</p>
                            <p className={"text-xl"}> {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}</p>
                            <p className={"text-xl"}>{shippingAddress.country}</p>

                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Bestellung Total</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className={"text-lg"}>Subtotal</span>
                                    <span>CHF {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className={"text-lg mb-2"}>Versand</span>
                                    <span>CHF {shippingCost.toFixed(2)}</span>
                                </div>
                                <Separator/>
                                <div className="flex justify-between font-bold">
                                    <span className={"text-2xl mt-2"}>Total</span>
                                    <span className={"text-2xl mt-2"}>CHF {total.toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">
                                <CreditCard className="mr-2 h-4 w-4"/>Verbindlich bestellen
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="mt-12">
                        <CardContent className="pt-6">
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Truck className="mr-6 h-8 w-8"/>
                                <span className={"text-xl"}>Geschätzte Lieferzeit: 3-5 Werktage</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}