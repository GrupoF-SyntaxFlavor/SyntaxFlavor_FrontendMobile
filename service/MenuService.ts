// MenuService.ts
import { BACKEND_DOMAIN, MINIO_PORT, SPRING_PORT } from "@/constants/.backend-dir";
import { formatImages } from "@/lib/ImageUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = `http://${BACKEND_DOMAIN}${SPRING_PORT}`; // Cuando pasemos a https cambiar aquí

export const fetchMenuItems = async (minPrice = 10, maxPrice = 20, pageNumber = 0, pageSize = 20, sortAscending = false) => {
  try {
    // Recuperar el token desde AsyncStorage
    const token = await AsyncStorage.getItem('access_token');
    
    if (!token) {
      throw new Error('No se encontró un token de acceso');
    }

    const url = `${API_URL}/api/v1/menu/item?minPrice=${minPrice}&maxPrice=${maxPrice}&pageNumber=${pageNumber}&pageSize=${pageSize}&sortAscending=${sortAscending}`;
    console.log("Fetching menu items from URL:", url);

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
    console.log("Menu items:", data);

    if (!Array.isArray(data.payload.content)) {
      throw new Error('Expected payload.content to be an array');
    }

    // Return the entire payload
    return data.payload;
  } catch (error) {
    console.error("Error fetching menu items:", error);
    throw error;
  }
};