import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router"; // Asegúrate de importar useRouter

//FIXME: Revisar que la pantalla se ajuste en distintos dispositivos

export default function WelcomeScreen() {
  const router = useRouter();

  const handleLoginPress = () => {
    router.push("/login"); // Redirige a la pantalla de login
  };
  const handleSingUpPress = () => {
    router.push("/singup"); // Redirige a la pantalla de login
  };
  return (
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
          onPress={handleSingUpPress}
        >
          <Text style={styles.buttonText}>Registrate</Text>
        </TouchableOpacity>

        {/* Botón de Iniciar Sesión */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
          <Text style={styles.loginText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between", // Espacio entre el contenido superior y los botones
    backgroundColor: "#fff", // Fondo blanco para la pantalla
    paddingVertical: 50, // Aseguramos un poco de margen vertical
  },
  topContainer: {
    alignItems: "center",
  },
  bottomContainer: {
    alignItems: "center",
  },
  logo: {
    marginTop: 30, // Asegura un poco de espacio en la parte superior
    width: 300, // Ajusta el tamaño del logo según el diseño
    height: 200,
    resizeMode: "contain",
  },
  sushiIcon: {
    width: 300, // Tamaño del ícono de sushi
    height: 150,
    resizeMode: "contain",
    marginBottom: 40,
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  divider_line: {
    width: "70%",
    marginBottom: 20,
    height: 3,
    borderBottomWidth: 1.5,
    borderBottomColor: "#ddd",
  },
  subtitle: {
    width: "85%",
    fontSize: 20,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20, // Para asegurar que el texto no toque los bordes
    marginTop: 10,
  },
  registerButton: {
    backgroundColor: "#86AB9A", // Color verde para el botón de registro
    paddingVertical: 20,
    paddingHorizontal: 75,
    borderRadius: 30,
    marginTop: 30,
    marginBottom: 20,
    width: "70%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  loginButton: {
    paddingVertical: 10,
    paddingHorizontal: 50,
  },
  loginText: {
    fontSize: 22,
    color: "#86AB9A",
    textDecorationLine: "underline",
  },
});
