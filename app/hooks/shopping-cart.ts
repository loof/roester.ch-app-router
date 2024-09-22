import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { cartAtom } from "@/app/atoms/shopping-cart-atom";
import { createCartItems, getCartItems, updateCartItem } from "@/lib/api/shopping-cart";

const LOCAL_STORAGE_KEY = 'shopping_cart';

export function useShoppingCart() {
    const [numberOfItems, setNumberOfItems] = useAtom(cartAtom);
    const { data: session, status } = useSession();
    const isAuthenticated = status === 'authenticated';
    const [shoppingCartItems, setShoppingCartItems] = useState([]);

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
                    const savedCart = await getCartItems(session.user.accessToken, session.user.cartId);
                    const savedCartLocalStorage = localStorage.getItem(LOCAL_STORAGE_KEY);
                    let combinedCart = savedCart;

                    if (savedCartLocalStorage) {
                        const parsedLocalCart = JSON.parse(savedCartLocalStorage);

                        let newItems = parsedLocalCart.filter((localCartItem) => {return !savedCart.some((dbItem) => {return dbItem.eventId === localCartItem.eventId && dbItem.variantId === localCartItem.variantId})})

                        newItems = newItems.map((newItem) => {return {
                            ...newItem,
                            cartId:session.user.cartId
                        }})

                        await createCartItems(session.user.accessToken, session.user.cartId, newItems)

                        // Merge server and local cart items
                        combinedCart = [...savedCart, ...parsedLocalCart];
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
    const addShoppingCartItem = (cartItem) => {
        if (!shoppingCartItems.some((item) => item.eventId === cartItem.eventId && item.variantId === cartItem.variantId)) {
            setNumberOfItems(prev => prev + 1);
        }
        setShoppingCartItems((prevCartItems) => {
            const existingItemIndex = prevCartItems.findIndex(
                (item) => item.eventId === cartItem.eventId && item.variantId === cartItem.variantId
            );

            // If item exists, update its amount correctly
            if (existingItemIndex !== -1) {
                const updatedCartItems = [...prevCartItems];
                updatedCartItems[existingItemIndex] = {
                    ...updatedCartItems[existingItemIndex],
                    amount: updatedCartItems[existingItemIndex].amount + cartItem.amount // Update amount correctly
                };

                // No state re-update here, return updated cart
                return updatedCartItems;
            } else {
                // If item doesn't exist, add it as a new item

                return [...prevCartItems, cartItem];
            }
        });

        // Perform the async operation after updating the state
        if (isAuthenticated && session?.user?.accessToken && session?.user?.cartId) {
            const fetchData = async () => {
                try {
                    const existingItem = shoppingCartItems.find(
                        (item) => item.eventId === cartItem.eventId && item.variantId === cartItem.variantId
                    );

                    if (existingItem) {
                        await updateCartItem(session.user.accessToken, {
                            ...existingItem,
                            amount: existingItem.amount + cartItem.amount // Update correct amount for the server
                        });
                    } else {
                        await createCartItems(session.user.accessToken, session?.user?.cartId, [cartItem]);
                    }
                } catch (error) {
                    console.error("Error updating cart item", error);
                }
            };
            fetchData();
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
    };

    return {
        shoppingCartItems,
        addShoppingCartItem,
        removeShoppingCartItem,
    };
}