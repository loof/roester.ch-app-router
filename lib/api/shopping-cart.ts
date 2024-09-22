const URL = process.env.NEXT_PUBLIC_BASE_URL


export async function getCartItems(token, cartId) {
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

    return data.items
}

export async function createCartItems(token, cartId, cartItems) {
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

export async function updateCartItem(token, cartItem) {
    const response = await fetch(`${URL}/carts/${cartItem.cartId}/items`, {
        method: "PATCH",
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${token}`
        },
        body: JSON.stringify(cartItem)
    })

    if (!response.ok) {
        throw new Error("An error occured while fetching")
    }

    const data = await response.json()
    return data
}


