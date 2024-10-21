"use client"

import { useState } from 'react'
import Link from 'next/link'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
    ChevronDown,
    ShoppingCart,
    DollarSign,
    Package,
    Search,
    ExternalLink, SearchIcon
} from 'lucide-react'
import {Order} from "@/types/order";
import CheckAuthAndRedirect from "@/components/check-auth-and-redirect";

export default function OrderOverview() {
    const [searchTerm, setSearchTerm] = useState("")
    const [sortColumn, setSortColumn] = useState("date")
    const [sortDirection, setSortDirection] = useState("desc")

    // This would typically come from your application's state or API
    const orders = [
        { id: "ORD-2023-001", date: "2023-10-20", customer: "John Doe", total: 150.00, status: "Delivered" },
        { id: "ORD-2023-002", date: "2023-10-21", customer: "Jane Smith", total: 89.99, status: "Shipped" },
        { id: "ORD-2023-003", date: "2023-10-22", customer: "Bob Johnson", total: 249.50, status: "Processing" },
        { id: "ORD-2023-004", date: "2023-10-23", customer: "Alice Brown", total: 75.25, status: "Paid" },
        { id: "ORD-2023-005", date: "2023-10-24", customer: "Charlie Wilson", total: 199.99, status: "Shipped" },
        { id: "ORD-2023-006", date: "2023-10-25", customer: "Eva Davis", total: 129.00, status: "Processing" },
        { id: "ORD-2023-007", date: "2023-10-26", customer: "Frank Miller", total: 299.99, status: "Paid" },
        { id: "ORD-2023-008", date: "2023-10-27", customer: "Grace Taylor", total: 59.99, status: "Delivered" },
    ]

    const filteredOrders = orders.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.status.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const sortedOrders = [...filteredOrders].sort((a, b) => {
        const key = sortColumn as keyof typeof a; // Use dynamic key extraction based on the actual object

        if (a[key] < b[key]) return sortDirection === "asc" ? -1 : 1;
        if (a[key] > b[key]) return sortDirection === "asc" ? 1 : -1;
        return 0;
    });



    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    const pendingOrders = orders.filter(order => order.status === "Processing" || order.status === "Paid").length

    const handleSort = (column: keyof Order) => {
        if (column === sortColumn) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };



    return (
        <CheckAuthAndRedirect>

        <div className="container mx-auto px-4 max-w-screen-lg">
            <h1 className="font-sans normal-case">Bestellungen</h1>

            {/*<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-12">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalOrders}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingOrders}</div>
                    </CardContent>
                </Card>
            </div>*/}

            <div className="flex justify-items-center gap-3 items-center mb-4 mt-12">


                <SearchIcon className="ml-2" />

                <Input
                    placeholder="Bestellungen suchen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm ml-2"
                />
             {/*   <Button variant="outline" className="ml-2">
                    <Search className="mr-2 h-4 w-4" /> Search
                </Button>*/}
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <span className="sr-only">Sort by ID</span>
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                        <DropdownMenuItem onClick={() => handleSort('id')}>
                                            Sort by ID
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                Order ID
                            </TableHead>
                            <TableHead>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <span className="sr-only">Sort by date</span>
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                        <DropdownMenuItem onClick={() => handleSort('date')}>
                                            Sort by Date
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                Date
                            </TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedOrders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">{order.id}</TableCell>
                                <TableCell>{order.date}</TableCell>
                                <TableCell>{order.customer}</TableCell>
                                <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            order.status === "Delivered" ? "default" :
                                                order.status === "Shipped" ? "secondary" :
                                                    order.status === "Processing" ? "outline" : "destructive"
                                        }
                                    >
                                        {order.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Link href={`/orders/${order.id}`} passHref>
                                        <Button variant="ghost" size="sm">
                                            Details
                                            <ExternalLink className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
        </CheckAuthAndRedirect>
    )
}