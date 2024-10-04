import { BACKEND_URL, IMAGE_URL } from "@/constants/.backend-dir";
import { Login } from "@/models/Login";
import { SignUp } from '../models/SignUp';

import AsyncStorage from "@react-native-async-storage/async-storage";

export const login = async (login: Login) => {
    // console.log("Login request:", login);
    try {
        const response = await fetch(`${BACKEND_URL}/api/v1/public/login`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            'Content-Type': "application/json",
        },
            body: JSON.stringify(login),
        });

        // console.log("Login response:", response);
        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // console.log("Login:", data.payload);
        return (data);
    } catch (error) {
        throw error;
    }
};

export const signup = async (SignUp: SignUp) => {
    console.log("signup request:", SignUp);
    try {
        const response = await fetch(`${BACKEND_URL}/api/v1/user/customer/profile`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            'Content-Type': "application/json",
        },
            body: JSON.stringify(SignUp),
        });

        // console.log("signup response:", response);
        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // console.log("signup:", data);
        return (data);
    } catch (error) {
        throw error;
    }
};

export const getCustomerProfile = async () => {
    try {
        // Recuperar el token desde AsyncStorage
        const token = await AsyncStorage.getItem('access_token');
        // console.log("recupera el token", token)
        
        if (!token) {
        throw new Error('No se encontró un token de acceso');
        }
        const response = await fetch(`${BACKEND_URL}/api/v1/user/customer/profile`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
        });


        // console.log("signup response:", response);
        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return (data);
    } catch (error) {
        throw error;
    }
};

/*PATCH http://localhost:8080/api/v1/user/customer
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ2dVpnWnhKWW01WjN2Y0xpeUY3OXJOUU9kZ0hiOU9HbFUtbldUX3BnSHRVIn0.eyJleHAiOjE3MjgwOTUyOTMsImlhdCI6MTcyODA1OTI5MywianRpIjoiNWVhYTA4OGYtNTI3NS00MjdjLWE3NDUtMzc2ZDQzOTI2MDdjIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgyL3JlYWxtcy9zeW50YXhmbGF2b3JfdXNlcnMiLCJhdWQiOlsicmVhbG0tbWFuYWdlbWVudCIsImFjY291bnQiXSwic3ViIjoiMjNhNDRmM2UtNTQ0MC00MjA3LTgyNjEtNDRmYzk2NTRhNTJjIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic3ludGF4Zmxhdm9yIiwic2lkIjoiOTBiOTYzNDMtN2M1MC00N2UwLTkzYTQtYzI3OGQ4ZWVmMGNlIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwOi8vMTcyLjE4LjYuMjEwOjgwODAiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtc3ludGF4Zmxhdm9yX3VzZXJzIiwib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7InJlYWxtLW1hbmFnZW1lbnQiOnsicm9sZXMiOlsiY3JlYXRlLWNsaWVudCIsIm1hbmFnZS11c2VycyIsInZpZXctdXNlcnMiLCJxdWVyeS1ncm91cHMiLCJxdWVyeS11c2VycyJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiU2NvdHQiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzaG9zdG9uMEBpbWd1ci5jb20iLCJnaXZlbl9uYW1lIjoiU2NvdHQiLCJlbWFpbCI6InNob3N0b24wQGltZ3VyLmNvbSJ9.q0I26yb3z6DhXQ5G_LxbtQGwbLUistddAynwP1xmZWnR8r6_uKkd9Iir6tdlLSlWshh8BIwdWPPmYHgpiR05sLZXAZd14TuS5FB3w0A_VgcyiwT6PFk9PDaG8GBHUsveRQofGz0-ukqv_vD_GmFAEzM2o1PWht1Ne7-TIyAo3NPwFWL0RCOYLWIsTb2BPdnAhNoBx9xqzCtG10PMPlnfXvUlZi0QcespIKggQRWDsi730Alj2yNeQCTTyu8xt6ayO4idEKrFBwrM3ZJYn3sJY-uDbSYThsYCmrrJJT9RsO8U4W0o_Sx6UyuuUbP9EckN9t4NQoy_8T-_Atf1nGaMbQ

{
  "customerId": 1,
  "billName": "MonteroUpdated",
  "nit":"12334135"
} */
export const updateCustomerProfile = async (billName:string, newCI:string) => {
    console.log("-------datos",billName,newCI)
    try {
        // Recuperar el token desde AsyncStorage
        const token = await AsyncStorage.getItem('access_token');
        // console.log("recupera el token", token)
        
        if (!token) {   
        throw new Error('No se encontró un token de acceso');
        }
        const response = await fetch(`${BACKEND_URL}/api/v1/user/customer`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            'Content-Type': "application/json",
        },
        body: JSON.stringify({
            billName: billName, // El nuevo nombre de facturación
            nit: newCI, // El nuevo CI/NIT
        }),
        });
        console.log("PATCH response", response)
        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return (data);
    } catch (error) {
        throw error;
    }
};

