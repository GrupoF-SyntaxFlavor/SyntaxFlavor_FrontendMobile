import { BACKEND_URL } from "@/constants/.backend-dir";
import { Order } from "@/models/Order";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const createOrder = async (order: Order) => {
    try {
        // Recuperar el token desde AsyncStorage
        const token = await AsyncStorage.getItem('access_token');
        console.log("recupera el token", token)
        
        if (!token) {
        throw new Error('No se encontró un token de acceso');
        }
        const response = await fetch(`${BACKEND_URL}/api/v1/public/order`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
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

export const fetchPastOrders = async (customerId: number) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/v1/public/order/customer?customerId=${customerId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Past orders:", data);
        return data;
    } catch (error) {
        console.error("Error fetching past orders:", error);
        throw error;
    } 
}

export const cancelOrder = async (orderId: number) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/v1/public/order/cancel?orderId=${orderId}`, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Order cancellation response:", data);
        return data;
    } catch (error) {
        console.error("Error cancelling order:", error);
        throw error;
    }
}