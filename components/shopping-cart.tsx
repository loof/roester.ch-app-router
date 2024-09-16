import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const LOCAL_STORAGE_KEY = 'shopping_cart';

const ShoppingCart = () => {
    const { data: session, status } = useSession();
    const isAuthenticated = status === 'authenticated';
    const [cart, setCart] = useState([]);

    // Load cart from local storage for unauthenticated users
    useEffect(() => {
        if (!isAuthenticated) {
            const savedCart = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (savedCart) {
                setCart(JSON.parse(savedCart));
            }
        }
    }, [isAuthenticated]);

    // Save cart to local storage for unauthenticated users
    useEffect(() => {
        if (!isAuthenticated) {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
        }
    }, [cart, isAuthenticated]);

    const addItem = (item) => {
        setCart((prevCart) => [...prevCart, item]);
    };

    const removeItem = (id) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };

    return (
        <div>
            <h1>Shopping Cart</h1>
            <ul>
                {cart.map((item) => (
                    <li key={item.id}>
                        {item.name} <button onClick={() => removeItem(item.id)}>Remove</button>
                    </li>
                ))}
            </ul>

            <button
                onClick={() => addItem({ id: Date.now(), name: 'New Item' })}
            >
                Add Item
            </button>
        </div>
    );
};

export default ShoppingCart;
