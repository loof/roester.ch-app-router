import {formatDate} from "@/lib/utils";

export default function DateJumbo({date, className}: {date: string, className?: string}) {
    let title = {}
    try {
        title = formatDate(date)
    } catch (error) {
        return (<></>)
    }
    return (
        <h2 className={className}>
            <time dateTime={date}>{formatDate(date)}</time>
        </h2>)
}