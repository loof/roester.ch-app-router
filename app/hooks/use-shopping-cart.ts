import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import {useAtom} from "jotai";
import {cartAtom} from "@/app/atoms/shopping-cart-atom";
import {createCartItems, getCart} from "@/lib/api/shopping-cart";
import {CartItem} from "@/types/cart-item";
import {Cart} from "@/types/cart";

const LOCAL_STORAGE_KEY = 'shopping_cart';

export function useShoppingCart() {
    const [cart, setCart] = useAtom(cartAtom);
    const { data: session, status } = useSession();
    const isAuthenticated = status === 'authenticated';
    const [isSyncing, setIsSyncing] = useState(false);  // To prevent multiple API calls

    // Load cart from local storage for unauthenticated users or server for authenticated users
    useEffect(() => {
        const fetchData = async () => {
            if (isSyncing) return;  // Prevent multiple sync attempts

            const localCart = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (!isAuthenticated) {
                if (localCart) {
                    const parsedCart = JSON.parse(localCart);
                    setCart(parsedCart);
                }
            } else if (isAuthenticated && session?.user?.accessToken && session.user.cartId) {
                try {
                    if (localCart) {
                        setIsSyncing(true);  // Prevent further execution until sync is done
                        const parsedLocalCart = JSON.parse(localCart);

                        if (parsedLocalCart.items.length > 0) {
                            const cart = await createCartItems(session.user.accessToken, session.user.cartId, parsedLocalCart.items);
                            setCart(cart);
                        }

                        localStorage.removeItem(LOCAL_STORAGE_KEY);
                    } else {
                        const dbCart = await getCart(session.user.accessToken, session.user.cartId);
                        setCart(dbCart);
                    }
                } catch (error) {
                    console.error("Error fetching cart items", error);
                } finally {
                    setIsSyncing(false);  // Mark sync as complete
                }
            }
        };

        if (!isSyncing) {
            fetchData();  // Only fetch if not currently syncing
        }
    }, [isAuthenticated, session, isSyncing]);  // Include isSyncing to trigger on changes to it


    // Save cart to local storage for unauthenticated users
    useEffect(() => {

        async function loadData() {

            if (!isAuthenticated && cart.items.length > 0) {
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
            }
        }

        loadData()
    }, [cart, isAuthenticated]);

    // Add or update item in the shopping cart
    const addShoppingCartItem = async (cartItem: CartItem) => {

        if (isAuthenticated && session?.user?.accessToken && session?.user?.cartId && !isSyncing){
            setIsSyncing(true);  // Start syncing process
            try {
                const newCart = await createCartItems(session.user.accessToken, session.user.cartId, [cartItem]);
                setCart(newCart)
            } catch (error) {
                console.error("Error syncing cart item to server", error);
            } finally {
                setIsSyncing(false);  // Syncing finished
            }
        } else if (!isAuthenticated) {
            setCart((prevCart : Cart ) => {
                const updatedCart : Cart  = {...prevCart};
                const existingItem  = prevCart.items.find((item) => item.eventId === cartItem.eventId && item.variantId === cartItem.variantId)
                if (existingItem) {
                    existingItem.amount += cartItem.amount;
                } else {
                    updatedCart.items.push(cartItem);
                }

                return updatedCart;

            })
        }
    };

    // Remove item from the shopping cart
    const removeShoppingCartItem = (id: number) => {
        setCart((prevCart : Cart) => {
            const newCart: Cart = {...prevCart};
            newCart.items = prevCart.items.filter((item) => item.id !== id);
            return newCart;
        });

        // Optionally, add code here to remove the item from the server if authenticated
    };

    return {
        cart,
        addShoppingCartItem,
        removeShoppingCartItem,
    };
}
