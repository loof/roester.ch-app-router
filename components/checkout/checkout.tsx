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
import {useShoppingCart} from "@/app/hooks/use-shopping-cart"
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog"

export default function Checkout() {
    const { cart, addShoppingCartItem, removeShoppingCartItem } = useShoppingCart();
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

    const shippingAddress = {
        name: "Yves Peissard",
        street: "Kasparstrasse 17",
        city: "3027",
        state: "Bern",
        zip: "",
        country: "Schweiz"
    }

    const subtotal = cart.items.reduce((sum, item) => sum + (item.variant?.price ?? 0) * item.amount, 0)
    const shippingCost = 5.99
    const tax = subtotal * 0.08 // Assuming 8% tax rate
    const total = subtotal + shippingCost + tax

    // Handle order confirmation
    const handleOrderConfirmation = () => {
        setIsModalOpen(true);  // Open modal on click
    };

    const confirmOrder = () => {
        // Here you can add the logic to proceed with the order
        console.log("Order confirmed!");
        setIsModalOpen(false); // Close modal after confirmation
    };

    const cancelOrder = () => {
        setIsModalOpen(false); // Close modal if user cancels
    };

    return (
        <div className="container mx-auto px-4 max-w-screen-lg">
            <h1 className="font-sans normal-case">Bestellübersicht</h1>

            <div className="grid gap-8 md:grid-cols-3 mt-12">
                <div className="md:col-span-2">
                    <Card>
                        <CardContent className={"mt-8"}>
                            {cart.items.length === 0 ? (
                                <p className="text-center text-xl">Keine Produkte im Warenkorb</p>
                            ) : (
                                cart.items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-start mb-4">
                                        <div className={"flex flex-col gap-1"}>
                                            <h3 className={"text-2xl mt-2 max-w-[300px]"}>{item.variant?.productName}</h3>
                                            <p className="text-xl text-muted-foreground">{item.variant?.name}</p>
                                            <p className="text-lg">Anzahl: {item.amount}</p>
                                        </div>
                                        <p className={"text-2xl mt-2"}>CHF {(item.variant?.price ?? 0).toFixed(2)}</p>

                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {cart.items.length > 0 && (
                        <Card className={"mt-12"}>
                            <CardHeader>
                                <CardTitle className="text-2xl">Lieferadresse</CardTitle>
                            </CardHeader>
                            <CardContent className={"text-sm"}>
                                <p className={"text-xl"}>{shippingAddress.street}</p>
                                <p className={"text-xl"}> {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}</p>
                                <p className={"text-xl"}>{shippingAddress.country}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {cart.items.length > 0 && (
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
                                <Button className="w-full" onClick={handleOrderConfirmation}>
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
                )}
            </div>

            {/* Modal component */}
            {isModalOpen && (
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="font-sans normal-case text-3xl">Bestellbestätigung</DialogTitle>
                        </DialogHeader>
                        <p className={"text-2xl"}>Willst du wirklich kostenpflichtig bestellen?</p>
                        <DialogFooter>
                            <Button onClick={confirmOrder}>Ja</Button>
                            <Button variant="outline" onClick={cancelOrder}>Nein</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}
