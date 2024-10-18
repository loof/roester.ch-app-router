"use client"

import { useState } from 'react'
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
        { id: 1, name: "Premium T-Shirt", variant: "Large / Black", price: 29.99, quantity: 2 },
        { id: 2, name: "Slim Fit Jeans", variant: "32W x 32L / Blue Denim", price: 59.99, quantity: 1 },
        { id: 3, name: "Classic Watch", variant: "Silver", price: 129.99, quantity: 1 },
    ]

    const shippingAddress = {
        name: "John Doe",
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zip: "12345",
        country: "United States"
    }

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shippingCost = 5.99
    const tax = subtotal * 0.08 // Assuming 8% tax rate
    const total = subtotal + shippingCost + tax

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Review Your Order</h1>

            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-semibold">{item.name}</h3>
                                        <p className="text-sm text-muted-foreground">{item.variant}</p>
                                        <p className="text-sm">Quantity: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="text-xl">Shipping Address</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible>
                                <AccordionItem value="address">
                                    <AccordionTrigger>
                                        <div className="flex items-center">
                                            <MapPin className="mr-2 h-4 w-4" />
                                            {shippingAddress.name}, {shippingAddress.city}
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p>{shippingAddress.street}</p>
                                        <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}</p>
                                        <p>{shippingAddress.country}</p>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Order Total</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>${shippingCost.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">
                                <CreditCard className="mr-2 h-4 w-4" /> Proceed to Payment
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="mt-6">
                        <CardContent className="pt-6">
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Truck className="mr-2 h-4 w-4" />
                                <span>Estimated delivery: 3-5 business days</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}