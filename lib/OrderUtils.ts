import { Product } from '../models/Product';
import { Order } from '../models/Order';

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