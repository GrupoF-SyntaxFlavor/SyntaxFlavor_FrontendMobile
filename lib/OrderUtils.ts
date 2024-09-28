import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { PastOrder } from '@/models/PastOrder';

// This function is used to create the payload for the order request
export const makeOrderPayload = (customerId: number, products: Product[]): Order => {
    const itemIdQuantityMap: Record<number, number> = products.reduce((map, product) => {
        if(product.quantity > 0) {
            map[product.id] = product.quantity;
        }
        return map;
    }, {} as Record<number, number>);

    return {
        customerId,
        itemIdQuantityMap,
    };
}

// This function is used to turn a PastOrder model into a set of products for the cart
export const orderToProducts = (pastOrder : PastOrder) : Product[] => {
    // TODO: If the menu items can change, then we should fetch the menu items from the server before 
    return pastOrder.orderItems.map(item => {
        return {
            id: item.menuItemId,
            name: item.menuItemName,
            description: null,
            price: item.price,
            image: null,
            quantity: item.quantity
        };
    });
}