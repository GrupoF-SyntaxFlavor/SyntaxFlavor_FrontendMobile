import { BACKEND_URL } from "@/constants/.backend-dir"; //FIXME: Cambiar BACKEND_URL por BACKEND_IP y SPRING_PORT
import { Login } from "@/models/Login";
import { SignUp } from "../models/SignUp";

import AsyncStorage from "@react-native-async-storage/async-storage";

//TODO: Agregar logs a las funciones de todos los service
export const login = async (login: Login) => {
  // console.log("Login request:", login);
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/public/login`, {
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
  console.log("signup request:", SignUp);
  try {
    //FIXME: El endpoint utilizado para esta función es de inicio de sesión no es el adecuado según documentación del backend
    const response = await fetch(
      `${BACKEND_URL}/api/v1/user/customer/profile`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(SignUp),
      }
    );

    console.log("signup response:", response);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("signup:", data);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getCustomerProfile = async () => {
  try {
    // Recuperar el token desde AsyncStorage
    const token = await AsyncStorage.getItem("access_token");
    // console.log("recupera el token", token)

    if (!token) {
      throw new Error("No se encontró un token de acceso");
    }
    const response = await fetch(
      `${BACKEND_URL}/api/v1/user/customer/profile`,
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
    return data;
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
    // Recuperar el token desde AsyncStorage
    const token = await AsyncStorage.getItem("access_token");
    // console.log("recupera el token", token)

    if (!token) {
      throw new Error("No se encontró un token de acceso");
    }
    const response = await fetch(`${BACKEND_URL}/api/v1/user/customer`, {
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
