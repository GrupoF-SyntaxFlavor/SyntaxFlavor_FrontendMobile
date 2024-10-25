export interface Product {
    id: number;
    name: string;
    description: string | null;
    price: number;
    image: string | null;
    quantity: number;
    status: boolean;
}