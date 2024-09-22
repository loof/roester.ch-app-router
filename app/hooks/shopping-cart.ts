import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { cartAtom } from "@/app/atoms/shopping-cart-atom";
import { createCartItems, getCartItems, updateCartItem } from "@/lib/api/shopping-cart";
import {update} from "next-auth/lib/actions";

const LOCAL_STORAGE_KEY = 'shopping_cart';

export function useShoppingCart() {
    const [numberOfItems, setNumberOfItems] = useAtom(cartAtom);
    const { data: session, status } = useSession();
    const isAuthenticated = status === 'authenticated';
    const [shoppingCartItems, setShoppingCartItems] = useState([]);
    const [isSyncing, setIsSyncing] = useState(false);  // To prevent multiple API calls

    // Load cart from local storage for unauthenticated users or server for authenticated users
    useEffect(() => {
        const fetchData = async () => {
            if (!isAuthenticated) {
                const savedCart = localStorage.getItem(LOCAL_STORAGE_KEY);
                if (savedCart) {
                    const parsedCart = JSON.parse(savedCart);
                    setShoppingCartItems(parsedCart);
                    setNumberOfItems(parsedCart.length);  // Set number based on distinct items
                }
            } else if (isAuthenticated && session.user.accessToken && session.user.cartId) {
                try {
                    let savedCart = await getCartItems(session.user.accessToken, session.user.cartId);
                    const savedCartLocalStorage = localStorage.getItem(LOCAL_STORAGE_KEY);
                    let combinedCart = savedCart;

                    if (savedCartLocalStorage) {
                        const parsedLocalCart = JSON.parse(savedCartLocalStorage);

                        let newLocalItems = parsedLocalCart.filter((localCartItem) =>
                            !savedCart.some((dbItem) =>
                                dbItem.eventId === localCartItem.eventId && dbItem.variantId === localCartItem.variantId
                            )
                        );
                        newLocalItems = newLocalItems.map((newItem) => ({ ...newItem, cartId: session.user.cartId }));

                        if (newLocalItems.length > 0) {
                            await createCartItems(session.user.accessToken, session.user.cartId, newLocalItems);
                        }

                        let existingLocalItems = parsedLocalCart.filter((localCartItem) =>
                            savedCart.some((dbItem) =>
                                dbItem.eventId === localCartItem.eventId && dbItem.variantId === localCartItem.variantId
                            )
                        );
                        savedCart = savedCart.map((savedCartItem) => {
                            let existingItem = existingLocalItems.find((existingItem) =>
                                existingItem.eventId === savedCartItem.eventId && existingItem.variantId === savedCartItem.variantId
                            );
                            if (existingItem) {
                                savedCartItem.amount += existingItem.amount;
                                updateCartItem(session.user.accessToken, savedCartItem);

                            }
                            return savedCartItem;
                        });

                        // Merge server and local cart items
                        combinedCart = [...savedCart, ...newLocalItems];
                        localStorage.removeItem(LOCAL_STORAGE_KEY);
                    }

                    setShoppingCartItems(combinedCart);
                    setNumberOfItems(combinedCart.length);  // Set number based on distinct items
                } catch (error) {
                    console.error("Error fetching cart items", error);
                }
            }
        };

        fetchData();
    }, [isAuthenticated, session]);

    // Save cart to local storage for unauthenticated users
    useEffect(() => {
        if (!isAuthenticated && shoppingCartItems.length > 0) {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(shoppingCartItems));
        }
    }, [shoppingCartItems, isAuthenticated]);

    // Add or update item in the shopping cart
    const addShoppingCartItem = async (cartItem) => {
        const existingItem = shoppingCartItems.find(
            (item) => item.eventId === cartItem.eventId && item.variantId === cartItem.variantId
        );

        if (!existingItem) {
            setNumberOfItems(prev => prev + 1);
        }

        setShoppingCartItems((prevCartItems) => {
            const updatedCartItems = [...prevCartItems];
            const existingItemIndex = updatedCartItems.findIndex(
                (item) => item.eventId === cartItem.eventId && item.variantId === cartItem.variantId
            );

            if (existingItemIndex !== -1) {
                updatedCartItems[existingItemIndex].amount += cartItem.amount;
            } else {
                updatedCartItems.push(cartItem);
            }

            return updatedCartItems;
        });

        if (isAuthenticated && session?.user?.accessToken && session?.user?.cartId && !isSyncing) {
            setIsSyncing(true);  // Start syncing process
            try {
                if (existingItem) {
                    await updateCartItem(session.user.accessToken, {
                        ...existingItem,
                        amount: existingItem.amount + cartItem.amount
                    });
                } else {
                    await createCartItems(session.user.accessToken, session.user.cartId, [cartItem]);
                }
            } catch (error) {
                console.error("Error syncing cart item to server", error);
            } finally {
                setIsSyncing(false);  // Syncing finished
            }
        }
    };

    // Remove item from the shopping cart
    const removeShoppingCartItem = (id) => {
        setShoppingCartItems((prevCartItems) => {
            const updatedCartItems = prevCartItems.filter((item) => item.id !== id);
            const removedItem = prevCartItems.find((item) => item.id === id);

            if (removedItem) {
                setNumberOfItems((prev) => prev - 1);
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
