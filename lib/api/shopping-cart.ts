import {CartItem} from "@/types/cart-item";

const URL = process.env.NEXT_PUBLIC_BASE_URL


export async function getCart(token: string, cartId: number) {
    const response = await fetch(`${URL}/carts/${cartId}`, {
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error("An error occurred while fetching")
    }

    const data = await response.json()

    return data
}

export async function createCartItems(token: string, cartId: number, cartItems: CartItem[]) {
    const response = await fetch(`${URL}/carts/${cartId}/items`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${token}`
        },
        body: JSON.stringify(cartItems)
    })

    if (!response.ok) {
        throw new Error("An error occured while fetching")
    }

    const data = await response.json()
    return data
}

export async function updateCartItem(token: string, cartItem: CartItem) {
    console.log(cartItem)
    const response = await fetch(`${URL}/carts/${cartItem.cartId}/items/${cartItem.id}`, {
        method: "PATCH",
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${token}`
        },
        body: JSON.stringify(cartItem)
    })

    if (!response.ok) {
        throw new Error("An error occured while updating cart item.")
    }

    const data = await response.json()
    return data
}

export async function removeCartItemById(token: string, id: number) {
    const response = await fetch(`${URL}/carts/${id}/items`, {
        method: "DELETE",
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error("An error occured while removing cart item by id.")
    }

}


