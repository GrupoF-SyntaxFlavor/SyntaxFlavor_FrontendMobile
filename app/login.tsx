import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from "react-native";
import { TextInput } from "react-native-paper";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // Para el icono de retroceso
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

import { login } from "@/service/UserService";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const colorScheme = useColorScheme();

  const handleLoginPress = async () => {
    try {
      //FIXME: @Oscar Agregar codigo de error y alert en el caso de que no se haya hecho la verificacion del correo

      const loginData = { email, password };
      const response = await login(loginData);
      // console.log("Login response in tsx:", response);

      if (response?.payload?.access_token) {
        // Guardar el token en AsyncStorage si la autenticación es exitosa
        await AsyncStorage.setItem(
          "access_token",
          response.payload.access_token
        );
        await AsyncStorage.setItem(
          "refresh_token",
          response.payload.refresh_token
        );
        await AsyncStorage.setItem(
          "expires_in",
          response.payload.expires_in.toString()
        );
        await AsyncStorage.setItem(
          "refresh_expires_in",
          response.payload.refresh_expires_in.toString()
        );
        await AsyncStorage.setItem(
          "refresh_token",
          response.payload.refresh_token
        );
        // console.log("Login successful:", response.payload);
        Alert.alert(
          "Inicio de sesión exitoso",
          "¡Bienvenido! Has iniciado sesión exitosamente."
        );
        // console.log('getItem', AsyncStorage.getItem);

        // Redirigir a la pantalla de menú
        router.push("/(tabs)/menu");
      } else {
        Alert.alert(
          "Error",
          "Las credenciales no son válidas, intenta de nuevo."
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Ocurrió un problema al intentar iniciar sesión.");
    }
  };

  const handleCreateAccountPress = () => {
    // Navegar a la vista de crear cuenta
    router.push("/signup"); // Asegúrate de tener la vista de registro
  };

  return (
    <View style={styles.container}>
      {/* Botón de retroceso */}
      {/* FIXME: @Oscar No utilizar routerback, redirigir siempre al index */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons
          name="arrow-back"
          size={30}
          color={Colors[colorScheme ?? "light"].tint}
        />
      </TouchableOpacity>

      {/* Título y subtítulo */}
      <Text style={styles.title}>Syntax Flavor</Text>
      <Text style={styles.subtitle}>Inicia Sesión</Text>

      {/* Campo de Correo Electrónico */}
      <TextInput
          style={styles.input}
          label="Correo electronico"
          placeholder="Ingresa tu correo"
          placeholderTextColor="#89898B" // Cambia el color del texto del placeholder
          value={email}
          onChangeText={setEmail}
          theme={{ colors: { primary: "#86AB9A" } }} // Color verde para el borde y el foco
          keyboardType="email-address"
          autoCapitalize="none" // Evita que la primera letra sea mayúscula
        />

      {/* Campo de Contraseña */}
      <TextInput
        style={styles.input}
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        theme={{ colors: { primary: "#86AB9A" } }} // Color verde para el borde y el foco
        secureTextEntry
      />

      {/* Botón de Iniciar Sesión */}
      <TouchableOpacity onPress={handleLoginPress} style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      {/* Texto de Crear Cuenta */}
      <Text style={styles.createAccountText}>
        ¿No tienes cuenta?{" "}
        <Text
          style={styles.createAccountLink}
          onPress={handleCreateAccountPress}
        >
          Crea una Cuenta
        </Text>
      </Text>
    </View>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: width * 0.08,
  },
  backButton: {
    position: "absolute",
    top: height * 0.05,
    left: width * 0.05,
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: "bold",
    marginBottom: height * 0.02,
    textAlign: "center",
  },
  subtitle: {
    fontSize: width * 0.05,
    marginBottom: height * 0.03,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: height * 0.08,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: width * 0.04,
    marginBottom: height * 0.02,
    fontSize: width * 0.04,
    backgroundColor: "#fff", // Fondo blanco
  },
  loginButton: {
    backgroundColor: "#86AB9A", // Color verde para el botón
    width: "80%",
    paddingVertical: height * 0.02,
    borderRadius: 10,
    marginTop: height * 0.01,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  createAccountText: {
    marginTop: height * 0.02,
    fontSize: width * 0.04,
    color: "#333",
  },
  createAccountLink: {
    color: "#86AB9A",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});