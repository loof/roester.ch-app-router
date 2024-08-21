const URL = process.env.NEXT_PUBLIC_API_URL

export async function login({email, password}) {
    const response = await fetch(`${URL}/auth/signin`, {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({email, password})
    })

    if (!response.ok) {
        throw new Error("An error occured while fetching")
    }

    const data = await response.json()
    return data
}

export async function signup({firstname, lastname, email, password}) {
    const response = await fetch(`${URL}/auth/signup`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({email, password, firstname, lastname})
    })

    if (!response.ok) {
        throw new Error("An error occured while fetching")
    }

    const data = await response.json()
    return data
}

export async function verify(code) {
    const response = await fetch(`${URL}/auth/verify?code=${code}`, {
        method: 'GET'
    })

    if (!response.ok) {
        throw new Error("An error occured while fetching")
    }

    const data = await response.json()
    return data
}