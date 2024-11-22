import { BACKEND_DOMAIN, SPRING_PORT } from "@/constants/.backend-dir"; 
import * as SecureStore from 'expo-secure-store';


import { Bill } from "@/models/Bill";

const API_URL = `http://${BACKEND_DOMAIN}${SPRING_PORT}` // Cuando pasemos a https cambiar aquí

export const createBill = async (bill: Bill) => {
    try {
        // Recuperar el token desde SecureStore
        const token = await SecureStore.getItem('access_token');
        // console.log("recupera el token", token)
        
        if (!token) {
        throw new Error('No se encontró un token de acceso');
        }
        const response = await fetch(`${API_URL}/api/v1/bill`, {
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
