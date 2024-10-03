import { BACKEND_URL, IMAGE_URL } from "@/constants/.backend-dir";
import { Login } from "@/models/Login";

export const login = async (login: Login) => {
    console.log("Login request:", login);
    try {
        const response = await fetch(`${BACKEND_URL}/api/v1/public/login`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            'Content-Type': "application/json",
        },
            body: JSON.stringify(login),
        });

        console.log("Login response:", response);
        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Login:", data.payload);
        return (data); // Retornamos los datos del menú
    } catch (error) {
        console.error("Error fetching menu items:", error);
        throw error;
    }
};

