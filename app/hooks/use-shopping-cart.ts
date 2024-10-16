import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import {useAtom} from "jotai";
import {cartAtom} from "@/app/atoms/shopping-cart-atom";
import {createCartItems, getCart, removeCartItemById, updateCartItem} from "@/lib/api/shopping-cart";
import {CartItem} from "@/types/cart-item";
import {Cart} from "@/types/cart";
import {v4 as uuidv4} from 'uuid';

const LOCAL_STORAGE_KEY = 'shopping_cart';

export function useShoppingCart() {

    const [cart, setCart] = useAtom(cartAtom);
    const { data: session, status } = useSession();
    const isAuthenticated = status === 'authenticated';
    const [isSyncing, setIsSyncing] = useState(false);  // To prevent multiple API calls

    const getNextCartItemId = () => {
        // Retrieve the current item id counter from localStorage (if it exists)
        const currentId = localStorage.getItem('cart_item_id_counter');
        let nextId = 1;  // Default ID if no counter exists

        if (currentId) {
            nextId = parseInt(currentId, 10) + 1;  // Increment the counter
        }

        // Store the updated counter back in localStorage
        localStorage.setItem('cart_item_id_counter', nextId.toString());

        return nextId;
    };

    const calculateCartTotal = (cartItems: CartItem[]): number => {
        return cartItems.reduce((total, item) => total + item.amount * (item.variant?.price || 0), 0);
    };

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
    const addShoppingCartItem = async (cartItem: CartItem, add: boolean) => {

        if (isAuthenticated && session?.user?.accessToken && session?.user?.cartId && !isSyncing){
            setIsSyncing(true);  // Start syncing process
            try {
                const newCart = await createCartItems(session.user.accessToken, session.user.cartId, [cartItem], add);
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
                    if (add) {
                        // If 'add' is true, take the maximum of the existing amount and the new amount
                        existingItem.amount += cartItem.amount;
                    } else {
                        // If 'add' is false, sum the existing amount and the new amount
                        existingItem.amount = Math.max(existingItem.amount, cartItem.amount);
                    }
                } else {
                    // If there is no existing item, create a new one and assign an ID
                    cartItem.id = getNextCartItemId();
                    updatedCart.items.push(cartItem);
                }


                // Calculate the new total
                updatedCart.total = calculateCartTotal(updatedCart.items);

                return updatedCart;

            })
        }
    };

    // Remove item from the shopping cart
    const removeShoppingCartItem = async (id: number, removeAll: boolean = false) => {
        if (isAuthenticated && session?.user?.accessToken && session?.user?.cartId && !isSyncing) {
            setIsSyncing(true); // Start syncing process

            try {
                // Find the item in the cart
                const existingItem = cart.items.find((item) => item.id === id);

                if (existingItem) {
                    if (removeAll) {
                        // If `removeAll` is true or only one item is left, remove the item from server and local state
                        await removeCartItemById(session.user.accessToken, id);

                        setCart((prevCart: Cart) => {
                            const newCart: Cart = {
                                ...prevCart,
                                items: prevCart.items.filter((item) => item.id !== id)
                            };
                            return newCart;
                        });
                    } else if (existingItem.amount > 1) {
                        // Decrease the amount in the server and local state if more than 1 left
                        const newAmount = existingItem.amount - 1;
                        existingItem.amount = newAmount;
                        await updateCartItem(session.user.accessToken, existingItem);

                        setCart((prevCart: Cart) => {
                            const newCart: Cart = { ...prevCart };
                            const itemIndex = newCart.items.findIndex((item) => item.id === id);

                            if (itemIndex !== -1) {
                                newCart.items[itemIndex] = {
                                    ...newCart.items[itemIndex],
                                    amount: newAmount
                                };
                            }

                            return newCart;
                        });
                    }


                }

            } catch (error) {
                console.error('Error removing cart item from server', error);
            } finally {
                setIsSyncing(false); // Syncing finished
            }
        } else if (!isAuthenticated) {
            // If not authenticated, just update the local state
            setCart((prevCart: Cart) => {
                const newCart: Cart = { ...prevCart };

                const itemIndex = newCart.items.findIndex((item) => item.id === id);
                if (itemIndex !== -1) {
                    const item = newCart.items[itemIndex];

                    if (item.amount > 1 && !removeAll) {
                        // Decrease amount if more than 1 left
                        newCart.items[itemIndex] = {
                            ...item,
                            amount: item.amount - 1,
                        };
                    } else if (removeAll) {
                        // Remove item entirely if amount is 1 or removeAll is true
                        newCart.items = newCart.items.filter((item) => item.id !== id);
                    }
                }

                if (newCart.items.length === 0) {
                    localStorage.removeItem(LOCAL_STORAGE_KEY);
                }

                // Calculate the new total
                newCart.total = calculateCartTotal(newCart.items);

                return newCart;
            });
        }
    };



    return {
        cart,
        addShoppingCartItem,
        removeShoppingCartItem,
    };
}
