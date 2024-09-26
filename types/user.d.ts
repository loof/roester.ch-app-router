interface UserType {
    email: string;
    accessToken: string;
    userId: number;
    cartId: number;
}

type UserResponseType = {
    email: string;
    accessToken: string;
    userId: number;
    cartId: number;
};

export type { UserType, UserResponseType };