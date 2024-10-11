import { MinusCircle, PlusCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {roundToFiveCents} from "@/lib/utils";
import {MinusIcon, PlusIcon} from "@/app/icons/icons";
import CartPageComponent from "@/components/cart/overview";
import CartOverview from "@/components/cart/overview";

interface CartItem {
    id: number
    name: string
    price: number
    amount: number
    variant: string
}

export default function CartPage() {
    return <CartOverview/>
}