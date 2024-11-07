import { BACKEND_DOMAIN, SPRING_PORT } from "@/constants/.backend-dir"; 
import { Order } from "@/models/Order";
import * as SecureStore from 'expo-secure-store';

const API_URL = `http://${BACKEND_DOMAIN}${SPRING_PORT}` // Cuando pasemos a https cambiar aquí

export const createOrder = async (orderData: Order) => {
    try {
      const token = await SecureStore.getItem('access_token');
      
      if (!token) {
        throw new Error('No se encontró un token de acceso');
      }

      console.log("Creating order with data:", orderData);
  
      const response = await fetch(`${API_URL}/api/v1/order`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Order created:", data);
      return data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
}

export const fetchPastOrders = async (status = 'Pendiente', pageNumber = 0, pageSize = 10, sortAscending = false) => {
    try {
        // Recuperar el token desde SecureStore
        const token = await SecureStore.getItem('access_token');
        console.log("recupera el token", token);
        
        if (!token) {
            throw new Error('No se encontró un token de acceso');
        }

        const url = `${API_URL}/api/v1/order/customer?status=${status}&pageNumber=${pageNumber}&pageSize=${pageSize}&sortAscending=${sortAscending}`;
        console.log("Fetching past orders from URL:", url);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });

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
};


export const cancelOrder = async (orderId: number) => {
    try {
        // Recuperar el token desde SecureStore
        const token = await SecureStore.getItem('access_token');
        
        if (!token) {
            throw new Error('No se encontró un token de acceso');
        }

        const response = await fetch(`${API_URL}/api/v1/order/cancel?orderId=${orderId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
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