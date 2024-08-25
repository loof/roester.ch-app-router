export default function InHowManyDays({deltaDays, className, classNameBigger}) {
    const prefix = deltaDays > 0 ? "in" : "war vor"

    return (
        <p className={className}>
            {deltaDays === 0 ? "Heute" :
                <>{prefix}
                <span className={`${classNameBigger} text-primary`}>{Math.abs(deltaDays) === 1 ? "einem" : Math.abs(deltaDays)}</span>
                    {Math.abs(deltaDays) > 1 ? "Tagen" : "Tag"}
            </>}
        </p>



   )
}