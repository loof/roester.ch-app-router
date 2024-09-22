"use server"

const URL = process.env.NEXT_PUBLIC_BASE_URL

export async function getAllEvents(token) {
    const response = await fetch(`${URL}/events`, {
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error("An error occurred while fetching")
    }

    return await response.json()
}

export async function getNextRoast() {
    const response = await fetch(`${URL}/events/next`, {
        headers: {
            "content-type": "application/json"
        }
    })

    if (!response.ok) {
        throw new Error("An error occurred while fetching")
    }

    return await response.json()
}

export async function getRoastByDate(date) {
    const response = await fetch(`${URL}/events/${date}`, {
        headers: {
            "content-type": "application/json"
        }
    })

    if (!response.ok) {
        throw new Error("An error occurred while fetching")
    }

    return await response.json()
}

export async function getRoastByPathVariableDate(date) {
    if (date === "next") {
        return await getNextRoast()
    } else if (date === "prev") {
        return await getPrevRoast()
    }

    return await getRoastByDate(date)
}

export async function getPrevRoast() {
    const response = await fetch(`${URL}/events/prev`, {
        headers: {
            "content-type": "application/json"
        }
    })

    if (!response.ok) {
        throw new Error("An error occurred while fetching")
    }

    const data = await response.json()
    return data
}

export async function getEventById(id) {
    const response = await fetch(`${URL}/events/${id}`)

    if (!response.ok) {
        throw new Error("An error occured while fetching")
    }

    const data = await response.json()
    return data
}
