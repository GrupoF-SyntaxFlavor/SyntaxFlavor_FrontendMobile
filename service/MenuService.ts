// MenuService.ts
import { BACKEND_URL, IMAGE_URL } from "@/constants/.backend-dir"; //FIXME: Cambiar por BACKEND_IP, SPRING_PORT y MINIO_PORT
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchMenuItems = async () => {
  try {
    // Recuperar el token desde AsyncStorage
    const token = await AsyncStorage.getItem('access_token');
    // console.log("recupera el token", token)
    
    if (!token) {
      throw new Error('No se encontró un token de acceso');
    }
    const response = await fetch(`${BACKEND_URL}/api/v1/menu/item`, {
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
    console.log("Menu items:", data.payload);
    return formatImages(data.payload); // Retornamos los datos del menú
  } catch (error) {
    console.error("Error fetching menu items:", error);
    throw error;
  }
};

const formatImages = (products: any) => {
  // replace the backend 'localhost' with the actual IP address
  // if the image URL is empty replace with palceholder
  return products.map((product: any) => {
    return {
      ...product,
      image: product.image
        ? product.image.replace("http://localhost:9000", IMAGE_URL)
        : "https://images.pond5.com/pixel-sushi-vector-illustration-isolated-illustration-155825087_iconm.jpeg",
    };
  });
}
