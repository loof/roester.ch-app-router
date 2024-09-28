export default function InHowManyDays({deltaDays, className, classNameBigger} : {deltaDays: number, className?: string, classNameBigger?: string}) {
    const prefix = deltaDays > 0 ? "in" : "war vor"

    return (
        <p className={className}>
            {deltaDays === 0 ? "Heute" :
                <>{prefix}
                <span className={`${classNameBigger}`}>{Math.abs(deltaDays) === 1 ? "einem" : Math.abs(deltaDays)}</span>
                    {Math.abs(deltaDays) > 1 ? "Tagen" : "Tag"}
            </>}
        </p>



   )
}