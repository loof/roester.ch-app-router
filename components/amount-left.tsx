"use client"

export default function AmountLeft({event, className}) {
    return (
        <p className={className}>
            {event.amountLeft} kg Vorrat
        </p>
    )
}