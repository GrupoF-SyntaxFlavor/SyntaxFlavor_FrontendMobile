import { BACKEND_URL } from "@/constants/.backend-dir";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Bill } from "@/models/Bill";

export const createBill = async (bill: Bill) => {
    try {
        // Recuperar el token desde AsyncStorage
        const token = await AsyncStorage.getItem('access_token');
        console.log("recupera el token", token)
        
        if (!token) {
        throw new Error('No se encontró un token de acceso');
        }
        const response = await fetch(`${BACKEND_URL}/api/v1/bill`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bill),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Bill response:", data);
        return data;
    } catch (error) {
        console.error("Error creating bill:", error);
        throw error;
    }
}
