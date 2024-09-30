import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { TextInput, HelperText } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

export default function SignupScreen() {
  const colorScheme = useColorScheme();

  const [step, setStep] = useState(1); // Controla el paso actual
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [billName, setBillName] = useState("");
  const [nit, setNit] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Completar registro
      console.log("Registro completado");
      router.push("/(tabs)/menu");
    }
  };

  const handlePreviousStep = () => {
    if (step === 1) {
      // Si estamos en el primer paso, redirigir a la página de inicio o la página deseada
      router.push("/");
    } else {
      // Si estamos en cualquier otro paso, disminuir el contador del paso
      setStep(step - 1);
    }
  };

  // Validaciones
  const isStepOneValid = name.length > 0 && email.includes("@");
  const isStepTwoValid = billName.length > 0 && nit.length > 0;
  const isStepThreeValid = password.length >= 8 && password === confirmPassword;

  return (
    <View style={styles.container}>
      {/* Botón de retroceso */}
      <TouchableOpacity style={styles.backButton} onPress={handlePreviousStep}>
        <Ionicons
          name="arrow-back"
          size={30}
          color={Colors[colorScheme ?? "light"].tint}
        />
      </TouchableOpacity>
      {step === 1 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>¡Empecemos!</Text>
          <Text style={styles.firstSubtitle}>
            Para comenzar, necesitamos algunos datos
          </Text>
          <TextInput
            style={styles.input}
            label="¿Cómo podemos llamarte?"
            placeholder="Ingresa tu nombre"
            placeholderTextColor="#89898B" // Cambia el color del texto del placeholder
            value={name}
            theme={{ colors: { primary: "#86AB9A" } }} // Color verde para el borde y el foco
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            label="Correo electronico"
            placeholder="Ingresa tu correo"
            placeholderTextColor="#89898B" // Cambia el color del texto del placeholder
            value={email}
            onChangeText={setEmail}
            theme={{ colors: { primary: "#86AB9A" } }} // Color verde para el borde y el foco
            keyboardType="email-address"
          />
          <TouchableOpacity
            style={[styles.button, !isStepOneValid && styles.buttonDisabled]} // Aplica el estilo de deshabilitado si no es válido
            onPress={handleNextStep}
            disabled={!isStepOneValid} // Habilita/deshabilita el botón
          >
            <Text style={styles.buttonText}>Siguiente ➔</Text>
          </TouchableOpacity>
          <Image
            source={require("../assets/images/pizza_box.png")}
            style={styles.imageFirstStep}
          />
        </View>
      )}

      {step === 2 && (
        <View style={styles.stepContainer}>
          <Image
            source={require("../assets/images/book_coffee.gif")}
            style={styles.imageSecondStep}
          />
          <Text style={styles.title}>Facturación</Text>
          <Text style={styles.secondSubtitle}>
            Proporciónanos tu nombre o razón social y NIT/CI
          </Text>
          <TextInput
            style={styles.input}
            label="Nombre de facturación"
            placeholder="Nombre o Razón Social"
            placeholderTextColor="#89898B"
            value={billName}
            theme={{ colors: { primary: "#86AB9A" } }} // Color verde para el borde y el foco
            onChangeText={setBillName}
          />
          <TextInput
            style={styles.input}
            label="Ingresa tu NIT/CI"
            placeholder="NIT/CI"
            placeholderTextColor="#89898B"
            value={nit}
            theme={{ colors: { primary: "#86AB9A" } }} // Color verde para el borde y el foco
            onChangeText={setNit}
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={[styles.button, !isStepTwoValid && styles.buttonDisabled]}
            onPress={handleNextStep}
            disabled={!isStepTwoValid}
          >
            <Text style={styles.buttonText}>Siguiente ➔</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 3 && (
        <View style={styles.stepContainer}>
          <Text style={styles.thirdTitle}>Asegura tu cuenta</Text>
          <Text style={styles.thirdSubtitle}>
            Crea una contraseña segura, asegúrate de usar al menos 8 caracteres
          </Text>
          <Image
            source={require("../assets/images/cat_cafe.png")}
            style={styles.imageThirdStep}
          />
          <TextInput
            style={styles.input}
            label="Crea una contraseña"
            placeholder="Contraseña"
            placeholderTextColor="#89898B"
            value={password}
            onChangeText={setPassword}
            theme={{ colors: { primary: "#86AB9A" } }} // Color verde para el borde y el foco
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            label="Confirma tu contraseña"
            placeholder="Contraseña"
            placeholderTextColor="#89898B"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            theme={{ colors: { primary: "#86AB9A" } }} // Color verde para el borde y el foco
            secureTextEntry
          />
          <TouchableOpacity
            style={[styles.button, !isStepThreeValid && styles.buttonDisabled]} // Aplica el estilo de deshabilitado si no es válido
            onPress={handleNextStep}
            disabled={!isStepThreeValid}
          >
            <Text style={styles.buttonText}>Completar Registro</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  stepContainer: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 38,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  thirdTitle: {
    fontSize: 38,
    fontWeight: "bold",
    marginBottom: 30,
    marginTop: 25,
    textAlign: "center",
  },
  firstSubtitle: {
    fontSize: 22,
    marginBottom: 70,
    marginHorizontal: 20,
    textAlign: "center",
  },
  secondSubtitle: {
    fontSize: 22,
    marginBottom: 30,
    marginHorizontal: 20,
    textAlign: "center",
  },
  thirdSubtitle: {
    fontSize: 22,
    marginBottom: 20,
    marginHorizontal: 20,
    textAlign: "center",
  },
  input: {
    width: "90%",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    width: "90%",
    backgroundColor: "#86AB9A",
    paddingVertical: 17,
    borderRadius: 30,
    marginTop: 20,
    marginBottom: 0,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ccc", // Cambia el color de fondo del botón deshabilitado
  },
  buttonText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  imageFirstStep: {
    width: 375,
    height: 200,
    marginTop: 20,
    resizeMode: "contain",
  },
  imageSecondStep: {
    width: 375,
    height: 250,
    marginTop: 20,
    resizeMode: "contain",
    marginBottom: 30,
  },
  imageThirdStep: {
    width: 250,
    height: 250,
    marginTop: 0,
    resizeMode: "contain",
  },
});
