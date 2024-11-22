export interface PastOrder {
    orderId: number;
    customerName: string;
    customerTable: string;
    orderStatus: string;
    orderTimestamp: string;
    orderItems: OrderItemModel[];
}

export interface OrderItemModel {
    menuItemId: number;
    menuItemName: string;
    image: string;
    price: number;
    quantity: number;
}