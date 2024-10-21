import { getCustomerProfile, updateCustomerProfile, login as loginService } from "@/service/UserService";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Alert } from "react-native";
import { AxiosError } from 'axios';

interface UserContextProps {
    name: string,
    email: string,
    nit: string,
    temporalNIT: string,
    billName: string,
    temporalBillName: string,
    jwt: string,
    login: (email: string, password: string) => Promise<void>,
    setUserProfile: () => void,
    updateUserProfile: (
        inputValue: string,
        field: "billName" | "ci"
    ) => void,
    setTemporalNIT: (value: string) => void,
    setTemporalBillName: (value: string) => void,
    logout: () => void,
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [nit, setNIT] = useState<string>('');
    const [temporalNIT, setTemporalNIT] = useState('');
    const [billName, setBillName] = useState<string>('');
    const [temporalBillName, setTemporalBillName] = useState('');
    const [jwt, setJWT] = useState<string>('');

    const login = async (email: string, password: string) => {
        try {
            const loginData = { email, password };
            const response = await loginService(loginData);
    
            if (response?.payload?.access_token) {
                // Save tokens to AsyncStorage
                await AsyncStorage.setItem("access_token", response.payload.access_token);
                await AsyncStorage.setItem("refresh_token", response.payload.refresh_token);
                await AsyncStorage.setItem("expires_in", response.payload.expires_in.toString());
                await AsyncStorage.setItem("refresh_expires_in", response.payload.refresh_expires_in.toString());
    
                setJWT(response.payload.access_token);
    
                Alert.alert("Inicio de sesión exitoso", "¡Bienvenido! Has iniciado sesión exitosamente.");
                router.push("/(tabs)/menu");
            } else {
                throw new Error("Credenciales no válidas");
            }
        } catch (error: any) {
            console.error("Login error:", error);
    
            let errorMessage = "Ocurrió un problema al intentar iniciar sesión.";
    
            if (isAxiosError(error)) {
                // Type guard for Axios error
                const serverMessage = (error.response?.data as { message?: string; error?: string })?.message || (error.response?.data as { message?: string; error?: string })?.error || "Error desconocido en el servidor.";
                errorMessage = `Error del servidor: ${serverMessage}`;
    
                if (error.response?.status === 401) {
                    errorMessage = "Acceso no autorizado. Verifica tus credenciales.";
                } else if (error.response?.status === 500) {
                    errorMessage = "Error del servidor. Por favor, intenta más tarde.";
                }
            } else if (error instanceof Error && error.message.includes("Network")) {
                errorMessage = "No se pudo conectar al servidor. Verifica tu conexión a Internet.";
            }
    
            // Mostrar mensaje de error personalizado
            Alert.alert("Error", errorMessage);
        }
    };
    
    // Helper function to check if the error is an Axios error
    function isAxiosError(error: any): error is AxiosError {
        return error.isAxiosError === true;
    }
    

    const setUserProfile = async () => {
        try {
            const data = await getCustomerProfile();
            setName(data.user.name);
            setEmail(data.user.email);
            setBillName(data.billName);
            setNIT(data.nit);
        } catch (error) {
            console.error("Error fetching profile data:", error);
        }
    };

    const updateUserProfile = async (
        inputValue: string,
        field: "billName" | "ci"
    ) => {
        if (field === "billName") {
            await updateCustomerProfile(inputValue, nit);
            setBillName(inputValue);
        } else if (field === "ci") {
            await updateCustomerProfile(billName, inputValue);
            setNIT(inputValue);
        }
    };

    const logout = async () => {
        await AsyncStorage.clear();
        setName('');
        setEmail('');
        setNIT('');
        setBillName('');
        setJWT('');
        router.push("/login");
    };

    return (
        <UserContext.Provider
            value={{
                name,
                email,
                nit,
                billName,
                jwt,
                temporalNIT,
                temporalBillName,
                login,
                setUserProfile,
                updateUserProfile,
                setTemporalNIT,
                setTemporalBillName,
                logout,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
