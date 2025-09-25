// utils/cart.ts
export interface CartItem {
    sku: string;
    name: string;
    price: number;
    imageUrl: string;
    quantity: number;
}

const CART_KEY = 'my_cart';

export const getCart = (): CartItem[] => {
    if (typeof window === 'undefined') return [];
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart: CartItem[]) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const addToCart = (item: CartItem, maxStock: number) => {
    const cart = getCart();
    const existingItem = cart.find(i => i.sku === item.sku);

    let newQuantity = item.quantity;
    if (existingItem) {
        newQuantity += existingItem.quantity;
    }

    if (newQuantity > maxStock) {
        throw new Error(`Cannot add more than ${maxStock} items to the cart`);
    }

    if (existingItem) {
        existingItem.quantity = newQuantity;
    } else {
        cart.push({ ...item, quantity: item.quantity });
    }

    saveCart(cart);
};
