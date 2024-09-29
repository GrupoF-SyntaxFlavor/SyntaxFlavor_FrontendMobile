import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SignupScreen() {
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
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Validaciones
  const isStepOneValid = name.length > 0 && email.includes("@");
  const isStepTwoValid = billName.length > 0 && nit.length > 0;
  const isStepThreeValid = password.length >= 8 && password === confirmPassword;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePreviousStep} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      {step === 1 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>¡Empecemos!</Text>
          <Text style={styles.subtitle}>
            Para comenzar, necesitamos algunos datos
          </Text>
          <TextInput
            style={styles.input}
            placeholder="¿Cómo podemos llamarte?"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu correo electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleNextStep}
            disabled={!isStepOneValid} // Habilita/deshabilita el botón
          >
            <Text style={styles.buttonText}>Siguiente ➔</Text>
          </TouchableOpacity>
          <Image
            source={require("../assets/images/sushi.png")}
            style={styles.image}
          />
        </View>
      )}

      {step === 2 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Facturación</Text>
          <Text style={styles.subtitle}>
            Proporciónanos tu nombre o razón social y NIT/CI
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa el nombre de facturación"
            value={billName}
            onChangeText={setBillName}
          />
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu NIT/CI"
            value={nit}
            onChangeText={setNit}
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleNextStep}
            disabled={!isStepTwoValid}
          >
            <Text style={styles.buttonText}>Siguiente ➔</Text>
          </TouchableOpacity>
          <Image
            source={require("../assets/images/sushi.png")}
            style={styles.image}
          />
        </View>
      )}

      {step === 3 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Asegura tu cuenta</Text>
          <Text style={styles.subtitle}>
            Crea una contraseña segura, asegúrate de usar al menos 8 caracteres.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Crea una contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirma tu contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleNextStep}
            disabled={!isStepThreeValid}
          >
            <Text style={styles.buttonText}>Completar Registro</Text>
          </TouchableOpacity>
          <Image
            source={require("../assets/images/sushi.png")}
            style={styles.image}
          />
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
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#86AB9A",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    resizeMode: "contain",
  },
});
