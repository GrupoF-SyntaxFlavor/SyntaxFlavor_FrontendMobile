import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions } from "react-native";
import { useRouter } from "expo-router"; // Asegúrate de importar useRouter

export default function WelcomeScreen() {
  const router = useRouter();

  const handleLoginPress = () => {
    router.push("/login"); // Redirige a la pantalla de login
  };
  const handleSignUpPress = () => {
    router.push("/signup"); // Redirige a la pantalla de login
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <View style={styles.topContainer}>
          {/* Logo */}
          <Image
            source={require("../assets/images/SYNTAX-FLAVOR.png")}
            style={styles.logo}
          />

          {/* Ícono de sushi */}
          <Image
            source={require("../assets/images/sushi.png")}
            style={styles.sushiIcon}
          />

          {/* Texto de Bienvenida */}
          <Text style={styles.title}>¡Bienvenido!</Text>
          <View style={styles.divider_line} />
          <Text style={styles.subtitle}>
            Disfruta de una experiencia gastronómica personalizada. Al alcance de
            un clic.
          </Text>
        </View>

        {/* Botones */}
        <View style={styles.bottomContainer}>
          {/* Botón de Registrarse */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleSignUpPress}
          >
            <Text style={styles.buttonText}>Registrate</Text>
          </TouchableOpacity>

          {/* Botón de Iniciar Sesión */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
            <Text style={styles.loginText}>Iniciar Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingVertical: height * 0.05,
  },
  topContainer: {
    alignItems: "center",
  },
  bottomContainer: {
    alignItems: "center",
  },
  logo: {
    marginTop: height * 0.03,
    width: width * 0.8,
    height: height * 0.25,
    resizeMode: "contain",
  },
  sushiIcon: {
    width: width * 0.8, // Tamaño del ícono de sushi
    height: height * 0.2,
    resizeMode: "contain",
    marginBottom: height * 0.05,
  },
  title: {
    fontSize: width * 0.09,
    fontWeight: "bold",
    marginBottom: height * 0.02,
    color: "#333",
  },
  divider_line: {
    width: "70%",
    marginBottom: height * 0.02,
    height: 3,
    borderBottomWidth: 1.5,
    borderBottomColor: "#ddd",
  },
  subtitle: {
    width: "85%",
    fontSize: width * 0.05,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.01,
  },
  registerButton: {
    backgroundColor: "#86AB9A", // Color verde para el botón de registro
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.2,
    borderRadius: 30,
    marginTop: height * 0.03,
    marginBottom: height * 0.02,
    width: "70%",
    minWidth: 200,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: width * 0.06,
    fontWeight: "bold",
    textAlign: "center",
    flexShrink: 1,
  },
  loginButton: {
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.15,
  },
  loginText: {
    fontSize: width * 0.06,
    color: "#86AB9A",
    textDecorationLine: "underline",
  },
});