const URL = process.env.NEXT_PUBLIC_BASE_URL

export async function login({ email, password }) {
    const response = await fetch(`${URL}/auth/signin`, {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
        throw new Error("An error occured while fetching")
    }

    const data = await response.json()
    return data
}