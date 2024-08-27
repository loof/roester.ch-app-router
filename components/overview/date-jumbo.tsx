import {formatDate} from "@/lib/util/utils";

export default function DateJumbo({date, className}) {
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