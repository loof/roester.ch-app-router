"use server"

const URL = process.env.NEXT_PUBLIC_BASE_URL

export async function getAllVariants(token) {
    const response = await fetch(`${URL}/variants`, {
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error("An error occurred while fetching variants")
    }

    return await response.json()
}

export async function getVariantById(id) {
    const response = await fetch(`${URL}/variants/${id}`, {
        headers: {
            "content-type": "application/json",
        }
    })

    if (!response.ok) {
        throw new Error("An error occurred while fetching the variant")
    }

    return await response.json()
}

export async function createVariant(token, variantData) {
    const response = await fetch(`${URL}/variants`, {
        method: 'POST',
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${token}`
        },
        body: JSON.stringify(variantData)
    })

    if (!response.ok) {
        throw new Error("An error occurred while creating the variant")
    }

    return await response.json()
}

export async function updateVariant(token, id, variantData) {
    const response = await fetch(`${URL}/variants/${id}`, {
        method: 'PATCH',
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${token}`
        },
        body: JSON.stringify(variantData)
    })

    if (!response.ok) {
        throw new Error("An error occurred while updating the variant")
    }

    return await response.json()
}

export async function deleteVariant(token, id) {
    const response = await fetch(`${URL}/variants/${id}`, {
        method: 'DELETE',
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error("An error occurred while deleting the variant")
    }

    return response.status === 204 // No Content response indicates successful deletion
}
