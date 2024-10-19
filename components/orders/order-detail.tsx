import { Check, Truck, CreditCard, Package, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function OrderDetail() {
    // This would typically come from your application's state or props
    const orderDetails = {
        orderNumber: "ORD-2023-85692",
        orderDate: "2023-10-15",
        status: "shipped",
        totalAmount: "$250.00",
        shippingAddress: "123 Main St, Anytown, AN 12345",
        trackingNumber: "1Z999AA1234567890",
    }

    const statuses = [
        { key: "ordered", label: "Ordered", icon: ShoppingCart, date: "Oct 15, 2023" },
        { key: "paid", label: "Paid", icon: CreditCard, date: "Oct 15, 2023" },
        { key: "shipped", label: "Shipped", icon: Package, date: "Oct 17, 2023" },
        { key: "delivered", label: "Delivered", icon: Truck, date: null },
    ]

    const currentStatusIndex = statuses.findIndex(s => s.key === orderDetails.status)

    return (
        <div className="container mx-auto px-4 max-w-screen-lg">
            <h1 className="font-sans normal-case">Order Status</h1>

            <Card className="mb-8 mt-12">
                <CardHeader>
                    <CardTitle>Order #{orderDetails.orderNumber}</CardTitle>
                    <CardDescription>Placed on {orderDetails.orderDate}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold mb-2">Shipping Address:</h3>
                            <p>{orderDetails.shippingAddress}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Total Amount:</h3>
                            <p>{orderDetails.totalAmount}</p>
                        </div>
                        {orderDetails.trackingNumber && (
                            <div className="md:col-span-2">
                                <h3 className="font-semibold mb-2">Tracking Number:</h3>
                                <p>{orderDetails.trackingNumber}</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="relative">
                {statuses.map((status, index) => (
                    <div key={status.key} className="flex items-center mb-8 last:mb-0">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-primary bg-background z-10">
                            {index <= currentStatusIndex ? (
                                <Check className="w-5 h-5 text-primary" />
                            ) : (
                                <status.icon className="w-5 h-5 text-muted-foreground" />
                            )}
                        </div>
                        <div className="ml-4 flex-grow">
                            <h3 className="font-semibold">{status.label}</h3>
                            {status.date && <p className="text-sm text-muted-foreground">{status.date}</p>}
                        </div>
                        {index <= currentStatusIndex && (
                            <Badge variant={index === currentStatusIndex ? "default" : "secondary"}>
                                {index === currentStatusIndex ? "Current Status" : "Completed"}
                            </Badge>
                        )}
                    </div>
                ))}
                <div className="absolute top-0 bottom-0 left-4 w-px bg-muted -translate-x-1/2 z-0" />
            </div>
        </div>
    )
}