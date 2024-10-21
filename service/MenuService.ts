// MenuService.ts
import { BACKEND_DOMAIN, MINIO_PORT, SPRING_PORT } from "@/constants/.backend-dir";
import { formatImages } from "@/lib/ImageUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = `http://${BACKEND_DOMAIN}${SPRING_PORT}` // Cuando pasemos a https cambiar aquí

export const fetchMenuItems = async () => {
  try {
    // Recuperar el token desde AsyncStorage
    const token = await AsyncStorage.getItem('access_token');
    // console.log("recupera el token", token)
    
    if (!token) {
      throw new Error('No se encontró un token de acceso');
    }
    const response = await fetch(`${API_URL}/api/v1/menu/item`, {
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

    return formatImages(data.payload.content); // Retornamos los datos del menú
  } catch (error) {
    console.error("Error fetching menu items:", error);
    throw error;
  }
};