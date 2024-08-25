'use client';

import { useUser } from '@auth0/nextjs-auth0/client';

export default function ProfilePage() {
    const { user, error, isLoading } = useUser();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;

    return (
        user && (
            <main className={"container max-w-screen-lg text-center font-display gap-16 lowercase"}>

                <img src={user.picture} alt={user.name}/>
                <h2>{user.name}</h2>
                <p>{user.email}</p>
            </main>
        )
    );
}