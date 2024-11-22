import { getCustomerProfile, updateCustomerProfile, login as loginService } from "@/service/UserService";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { router } from "expo-router";
import { AxiosError } from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store';

interface UserContextProps {
    name: string,
    email: string,
    nit: string,
    temporalNIT: string,
    billName: string,
    temporalBillName: string,
    jwt: string,
    login: (email: string, password: string) => Promise<void>,
    setUserProfile: () => Promise<void>,
    updateUserProfile: (
        inputValue: string,
        field: "billName" | "ci"
    ) => Promise<void>,
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

    useEffect(() => {
        const loadBillingData = async () => {
            const storedBillName = await SecureStore.getItem('billName');
            const storedNIT = await SecureStore.getItem('nit');
            if (storedBillName) setBillName(storedBillName);
            if (storedNIT) setNIT(storedNIT);
        };
        loadBillingData();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const loginData = { email, password };
            const response = await loginService(loginData);
    
            if (response?.payload?.access_token) {
                await SecureStore.setItemAsync("access_token", response.payload.access_token);
                await SecureStore.setItemAsync("refresh_token", response.payload.refresh_token);
                await SecureStore.setItemAsync("expires_in", response.payload.expires_in.toString());
                await SecureStore.setItemAsync("refresh_expires_in", response.payload.refresh_expires_in.toString());
    
                setJWT(response.payload.access_token);
                router.push("/(tabs)/menu");
            } else {
                throw new Error("Credenciales no válidas");
            }
        } catch (error: any) {
            console.error("Login error:", error);
        }
    };
    
    function isAxiosError(error: any): error is AxiosError {
        return error.isAxiosError === true;
    }
    
    const setUserProfile = async () => {
        if (!jwt) {
            console.warn("User is not logged in; cannot fetch profile data.");
            return;
        }
        try {
            const data = await getCustomerProfile();
            setName(data.user.name);
            setEmail(data.user.email);
            setBillName(data.billName);
            setNIT(data.nit);
            await SecureStore.setItem('billName', data.billName);
            await SecureStore.setItem('nit', data.nit);
        } catch (error) {
            console.error("Error fetching profile data:", error);
        }
    };

    const updateUserProfile = async (
        inputValue: string,
        field: "billName" | "ci"
    ) => {
        if (!jwt) {
            console.warn("User is not logged in; cannot update profile data.");
            return;
        }
        try {
            if (field === "billName") {
                await updateCustomerProfile(inputValue, nit);
                setBillName(inputValue);
                await SecureStore.setItem('billName', inputValue);
            } else if (field === "ci") {
                await updateCustomerProfile(billName, inputValue);
                setNIT(inputValue);
                await SecureStore.setItem('nit', inputValue);
            }
        } catch (error) {
            console.error("Error updating profile data:", error);
        }
    };

    const logout = async () => {
        try {
            // Borra cada dato específico de SecureStore
            await SecureStore.deleteItemAsync("access_token");
            await SecureStore.deleteItemAsync("refresh_token");
            await SecureStore.deleteItemAsync("expires_in");
            await SecureStore.deleteItemAsync("refresh_expires_in");
            await SecureStore.deleteItemAsync("billName");
            await SecureStore.deleteItemAsync("nit");
    
            // Restablece el estado de los datos de usuario
            setName('');
            setEmail('');
            setNIT('');
            setBillName('');
            setJWT('');
    
            // Navega a la pantalla de inicio de sesión
            router.push("/login");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
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
