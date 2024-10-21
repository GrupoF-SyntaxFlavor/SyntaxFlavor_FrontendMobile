import { getCustomerProfile, updateCustomerProfile, login as loginService } from "@/service/UserService";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
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
            const storedBillName = await AsyncStorage.getItem('billName');
            const storedNIT = await AsyncStorage.getItem('nit');
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
                await AsyncStorage.setItem("access_token", response.payload.access_token);
                await AsyncStorage.setItem("refresh_token", response.payload.refresh_token);
                await AsyncStorage.setItem("expires_in", response.payload.expires_in.toString());
                await AsyncStorage.setItem("refresh_expires_in", response.payload.refresh_expires_in.toString());
    
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
            await AsyncStorage.setItem('billName', data.billName);
            await AsyncStorage.setItem('nit', data.nit);
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
                await AsyncStorage.setItem('billName', inputValue);
            } else if (field === "ci") {
                await updateCustomerProfile(billName, inputValue);
                setNIT(inputValue);
                await AsyncStorage.setItem('nit', inputValue);
            }
        } catch (error) {
            console.error("Error updating profile data:", error);
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
