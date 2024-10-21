import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from "react-native";
import { TextInput } from "react-native-paper";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useUser } from "@/contexts/UserContext";

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const colorScheme = useColorScheme();
    const { login } = useUser();

    const handleLoginPress = () => {
        login(email, password);
    };

    const handleCreateAccountPress = () => {
        router.push("/signup");
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons
                    name="arrow-back"
                    size={30}
                    color={Colors[colorScheme ?? "light"].tint}
                />
            </TouchableOpacity>
            <Text style={styles.title}>Syntax Flavor</Text>
            <Text style={styles.subtitle}>Inicia Sesión</Text>
            <TextInput
                style={styles.input}
                label="Correo electronico"
                placeholder="Ingresa tu correo"
                placeholderTextColor="#89898B"
                value={email}
                onChangeText={setEmail}
                theme={{ colors: { primary: "#86AB9A" } }}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                label="Contraseña"
                value={password}
                onChangeText={setPassword}
                theme={{ colors: { primary: "#86AB9A" } }}
                secureTextEntry
            />
            <TouchableOpacity onPress={handleLoginPress} style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            </TouchableOpacity>
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