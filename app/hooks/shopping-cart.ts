import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { cartAtom } from "@/app/atoms/shopping-cart-atom";
import { createCartItems, getCartItems, updateCartItem } from "@/lib/api/shopping-cart";
import {update} from "next-auth/lib/actions";

const LOCAL_STORAGE_KEY = 'shopping_cart';

export function useShoppingCart() {
    const [cart, setCart] = useAtom(cartAtom);
    const { data: session, status } = useSession();
    const isAuthenticated = status === 'authenticated';
    const [isSyncing, setIsSyncing] = useState(false);  // To prevent multiple API calls

    // Load cart from local storage for unauthenticated users or server for authenticated users
    useEffect(() => {
        const fetchData = async () => {
            if (!isAuthenticated) {
                const savedCart = localStorage.getItem(LOCAL_STORAGE_KEY);
                if (savedCart) {
                    const parsedCart = JSON.parse(savedCart);
                    setCart(parsedCart);
                }
            } else if (isAuthenticated && session.user.accessToken && session.user.cartId) {
                try {
                    let dbCart = await getCartItems(session.user.accessToken, session.user.cartId);
                    const localCart = localStorage.getItem(LOCAL_STORAGE_KEY);
                    let combinedCart = dbCart;

                    if (localCart) {
                        const parsedLocalCart = JSON.parse(localCart);

                        if (parsedLocalCart.length > 0) {
                            const cart =  await createCartItems(session.user.accessToken, session.user.cartId, parsedLocalCart);
                            setCart(cart)
                        }

                        localStorage.removeItem(LOCAL_STORAGE_KEY);
                    }

                } catch (error) {
                    console.error("Error fetching cart items", error);
                }
            }
        };

        fetchData();
    }, [isAuthenticated, session]);

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
    const addShoppingCartItem = async (cartItem) => {
        const existingItem = cart.items.find(
            (item) => item.eventId === cartItem.eventId && item.variantId === cartItem.variantId
        );

        if (isAuthenticated && session?.user?.accessToken && session?.user?.cartId && !isSyncing){
            setIsSyncing(true);  // Start syncing process
            try {
                const newCart = await createCartItems(session.user.accessToken, session.user.cartId, [cart.items]);
                setCart(newCart)
            } catch (error) {
                console.error("Error syncing cart item to server", error);
            } finally {
                setIsSyncing(false);  // Syncing finished
            }
        } else if (!isAuthenticated) {
            setCart((prevCart) => {
                const updatedCart = [...prevCart];
                const existingItemIndex = updatedCart.items.findIndex(
                    (item) => item.eventId === cartItem.eventId && item.variantId === cartItem.variantId
                );

                if (existingItemIndex !== -1) {
                    updatedCart.items[existingItemIndex].amount += cartItem.amount;
                } else {
                    updatedCart.push(cartItem);
                }

                return updatedCart;
            });
        }
    };

    // Remove item from the shopping cart
    const removeShoppingCartItem = (id) => {
        setShoppingCartItems((prevCartItems) => {
            const updatedCartItems = prevCartItems.filter((item) => item.id !== id);
            const removedItem = prevCartItems.find((item) => item.id === id);

            if (removedItem) {
                setCart((prev) => prev - 1);
            }

            return updatedCartItems;
        });

        // Optionally, add code here to remove the item from the server if authenticated
    };

    return {
        shoppingCartItems,
        addShoppingCartItem,
        removeShoppingCartItem,
    };
}
