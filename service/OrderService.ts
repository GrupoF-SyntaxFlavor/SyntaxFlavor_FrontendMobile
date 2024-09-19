import { BACKEND_URL } from "@/constants/.backend-dir";
import { Order } from "@/models/Order";

export const createOrder = async (order: Order) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/v1/order`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(order),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Order response:", data);
        return data;
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
}