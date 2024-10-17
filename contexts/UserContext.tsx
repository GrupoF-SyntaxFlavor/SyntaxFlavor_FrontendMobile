import { getCustomerProfile, updateCustomerProfile } from "@/service/UserService";
import { createContext, ReactNode, useContext, useEffect, useState } from "react"

interface UserContextProps {
    name: string,
    email: string,
    nit: string,
    temporalNIT: string,
    billName: string,
    temporalBillName: string,
    jwt: string,
    setUserProfile: () => void,
    updateUserProfile: (
        inputValue: string,
        field: "billName" | "ci"
    ) => void
    setTemporalNIT: (value: string) => void,
    setTemporalBillName: (value: string) => void,
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

    // TODO: @AleCar set UseEffect to retireve JWT if valid

    // TODO: Methods
    const setUserProfile = async () => {
        try {
            const data = await getCustomerProfile(); // Llama al endpoint
            setName(data.user.name); // Establece el nombre del usuario
            setEmail(data.user.email); // Establece el correo
            setBillName(data.billName); // Establece el billName
            setNIT(data.nit); // Establece el CI/NIT
        } catch (error) {
            console.error("Error fetching profile data:", error);
        }
    }

    const updateUserProfile = async (
        inputValue: string,
        field: "billName" | "ci"
    ) => {
        // TODO: this should be a single flow not split in two
        if (field === "billName") {
            await updateCustomerProfile(inputValue, nit); // Envía el nuevo billName y el CI original
            setBillName(inputValue); // Actualiza el estado local de billName
        } else if (field === "ci") {
            await updateCustomerProfile(billName, inputValue); // Envía el billName original y el nuevo CI
            setNIT(inputValue); // Actualiza el estado local de CI
        }
    }

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
                // Methods
                setUserProfile,
                updateUserProfile,
                setTemporalNIT,
                setTemporalBillName
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
}