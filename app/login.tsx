import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // Para el icono de retroceso
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const colorScheme = useColorScheme();

  const handleLoginPress = () => {
    // Lógica para el botón de iniciar sesión
    router.push("/(tabs)/menu"); // Redirige a la vista principal de la app
  };

  const handleCreateAccountPress = () => {
    // Navegar a la vista de crear cuenta
    router.push("/singup"); // Asegúrate de tener la vista de registro
  };

  return (
    <View style={styles.container}>
      {/* Botón de retroceso */}
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
        placeholder="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Campo de Contraseña */}
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 30,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#86AB9A", // Color verde para el botón
    width: "100%",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  createAccountText: {
    marginTop: 20,
    fontSize: 16,
    color: "#333",
  },
  createAccountLink: {
    color: "#86AB9A",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
