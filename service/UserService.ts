import { BACKEND_DOMAIN, SPRING_PORT } from "@/constants/.backend-dir"; 
import { Login } from "@/models/Login";
import { SignUp } from "../models/SignUp";
import * as SecureStore from 'expo-secure-store';

const API_URL = `http://${BACKEND_DOMAIN}${SPRING_PORT}` // Cuando pasemos a https cambiar aquí

//TODO: Agregar logs a las funciones de todos los service
export const login = async (login: Login) => {
  // console.log("Login request:", login);
  try {
    const response = await fetch(`${API_URL}/api/v1/public/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(login),
    });

    // console.log("Login response:", response);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // console.log("Login:", data.payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const signup = async (SignUp: SignUp) => {
  console.log("signup request received");
  try {
    const response = await fetch(
      `${API_URL}/api/v1/public/signup?type=customer`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(SignUp),
      }
    );

    console.log("signup response status:", response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("signup response received");
    return data;
  } catch (error) {
    throw error;
  }
};

export const getCustomerProfile = async () => {
  try {
    // Recuperar el token desde SecureStore
    const token = await SecureStore.getItem("access_token");
    // console.log("recupera el token", token)

    if (!token) {
      throw new Error("No se encontró un token de acceso");
    }
    const response = await fetch(
      `${API_URL}/api/v1/user/customer/profile`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    // console.log("signup response:", response);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.payload;
  } catch (error) {
    throw error;
  }
};

export const updateCustomerProfile = async (
  billName: string,
  newCI: string
) => {
  console.log("-------datos", billName, newCI);
  try {
    // Recuperar el token desde SecureStore
    const token = await SecureStore.getItem("access_token");
    // console.log("recupera el token", token)

    if (!token) {
      throw new Error("No se encontró un token de acceso");
    }
    const response = await fetch(`${API_URL}/api/v1/user/customer`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        billName: billName, // El nuevo nombre de facturación
        nit: newCI, // El nuevo CI/NIT
      }),
    });
    console.log("PATCH response", response);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
