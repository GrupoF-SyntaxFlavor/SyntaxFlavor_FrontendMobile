// MenuService.ts
import { BACKEND_URL } from "../../constants/.backend-dir";

export const fetchMenuItems = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/menu/item`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Menu items:", data.payload);
      return data.payload; // Retornamos los datos del menú
    } catch (error) {
      console.error("Error fetching menu items:", error);
      throw error;
    }
  };
  