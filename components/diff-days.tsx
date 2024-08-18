"use client"

export default function DiffDays({prefix, data, className}) {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date(data && data.id ? data.date : null);
    const secondDate = new Date();
    const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));

    return (<p className={className}>{prefix} <span className={"mx-1 text-primary text-7xl"}>{diffDays > 1 ? diffDays : "einem"}</span> {diffDays > 1 ? "Tagen" : "Tag"}</p>)
}