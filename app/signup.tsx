import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput, HelperText } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

import { signup } from "@/service/UserService";

export default function SignupScreen() {
  const colorScheme = useColorScheme();

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [billName, setBillName] = useState("");
  const [nit, setNit] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  
  const handleNextStep = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      try {
        const signupData = { name, email, password, nit, billName };
        const response = await signup(signupData);
        if (response?.responseCode == "USR-001") {
          setStep(4); // Avanzar al paso 4 si el registro es exitoso
        } else {
          Alert.alert(
            "Error",
            "Los datos ingresados no son válidos, intenta de nuevo."
          );
        }
      } catch (error) {
        Alert.alert(
          "Error",
          "Ocurrió un problema al intentar crear la cuenta."
        );
      }
    }
  };

  const handlePreviousStep = () => {
    if (step === 1) {
      router.push("/");
    } else {
      setStep(step - 1);
    }
  };

  const handleNitChange = (text: string) => {
    const regex = /^[0-9-]+$/;
    if (regex.test(text)) {
      setNit(text);
    }
  };

  const isStepOneValid = name.length > 0 && email.includes("@");
  const isStepTwoValid = billName.length > 0 && nit.length > 0;
  const isStepThreeValid = password.length >= 8 && password === confirmPassword;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        {step < 4 && (
          <TouchableOpacity style={styles.backButton} onPress={handlePreviousStep}>
            <Ionicons
              name="arrow-back"
              size={30}
              color={Colors[colorScheme ?? "light"].tint}
            />
          </TouchableOpacity>
        )}
    
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
              placeholderTextColor="#89898B"
              value={name}
              theme={{ colors: { primary: "#86AB9A" } }}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              label="Correo electrónico"
              placeholder="Ingresa tu correo"
              placeholderTextColor="#89898B"
              value={email}
              onChangeText={setEmail}
              theme={{ colors: { primary: "#86AB9A" } }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={[styles.button, !isStepOneValid && styles.buttonDisabled]}
              onPress={handleNextStep}
              disabled={!isStepOneValid}
            >
              <Text style={styles.buttonText}>Siguiente ➔</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.backButtonCustom}
              onPress={handlePreviousStep}
            >
              <Text style={styles.buttonText}>Volver Atrás</Text>
            </TouchableOpacity>
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
              theme={{ colors: { primary: "#86AB9A" } }}
              onChangeText={setBillName}
            />
            <TextInput
              style={styles.input}
              label="Ingresa tu NIT/CI"
              placeholder="NIT/CI"
              placeholderTextColor="#89898B"
              value={nit}
              theme={{ colors: { primary: "#86AB9A" } }}
              onChangeText={handleNitChange}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={[styles.button, !isStepTwoValid && styles.buttonDisabled]}
              onPress={handleNextStep}
              disabled={!isStepTwoValid}
            >
              <Text style={styles.buttonText}>Siguiente ➔</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.backButtonCustom}
              onPress={handlePreviousStep}
            >
              <Text style={styles.buttonText}>Volver Atrás</Text>
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
              theme={{ colors: { primary: "#86AB9A" } }}
              secureTextEntry={!showPassword}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />
            <HelperText type="info" visible={true}>
              La contraseña debe tener al menos 8 caracteres.
            </HelperText>
            <TextInput
              style={styles.input}
              label="Confirma tu contraseña"
              placeholder="Contraseña"
              placeholderTextColor="#89898B"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              theme={{ colors: { primary: "#86AB9A" } }}
              secureTextEntry={!showConfirmPassword}
              right={
                <TextInput.Icon
                  icon={showConfirmPassword ? "eye-off" : "eye"}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
            />
            <HelperText type="info" visible={true}>
              La contraseña debe tener al menos 8 caracteres.
            </HelperText>
            <TouchableOpacity
              style={[styles.button, !isStepThreeValid && styles.buttonDisabled]}
              onPress={handleNextStep}
              disabled={!isStepThreeValid}
            >
              <Text style={styles.buttonText}>Completar Registro</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.backButtonCustom}
              onPress={handlePreviousStep}
            >
              <Text style={styles.buttonText}>Volver Atrás</Text>
            </TouchableOpacity>
          </View>
        )}
    
        {step === 4 && (
          <View style={styles.stepContainer}>
            <Text style={styles.title}>Revisa tu correo</Text>
            <Text style={styles.secondSubtitle}>
              Te hemos enviado un enlace para confirmar tu cuenta. Por favor, revisa tu correo electrónico.
            </Text>
            <Image
              source={require("../assets/images/check-mail.png")}
              style={[styles.imageThirdStep, { width: 100, height: 100 }]}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/login")} // Navegar al inicio de sesión
            >
              <Text style={styles.buttonText}>Ir al inicio de sesión</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  stepContainer: {
    width: "100%",
    alignItems: "center",
    paddingBottom: height * 0.05, // Añadir espacio debajo del botón
  },
  backButtonCustom: {
    width: "90%", // Mismo ancho que el botón de "Siguiente"
    backgroundColor: "#86AB9A", // Mismo color que el botón de "Siguiente"
    paddingVertical: height * 0.017,
    borderRadius: 30,
    marginTop: height * 0.02,
    alignItems: "center",
    marginBottom: height * 0.02, // Añade un margen inferior si es necesario
  },  
  title: {
    fontSize: width * 0.09,
    fontWeight: "bold",
    marginBottom: height * 0.03,
    textAlign: "center",
  },
  secondSubtitle: {
    fontSize: width * 0.055,
    marginBottom: height * 0.03,
    marginHorizontal: width * 0.05,
    textAlign: "center",
  },
  input: {
    width: "90%",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: height * 0.015,
    backgroundColor: "#fff",
  },
  button: {
    width: "90%",
    backgroundColor: "#86AB9A",
    paddingVertical: height * 0.017,
    borderRadius: 30,
    marginTop: height * 0.02,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: width * 0.055,
    fontWeight: "bold",
  },
  imageSecondStep: {
    width: width * 0.9,
    height: height * 0.3,
    marginTop: height * 0.02,
    resizeMode: "contain",
    marginBottom: height * 0.03,
  },
  thirdTitle: {
    fontSize: width * 0.09,
    fontWeight: "bold",
    marginBottom: height * 0.03,
    marginTop: height * 0.025,
    textAlign: "center",
  },
  firstSubtitle: {
    fontSize: width * 0.055,
    marginBottom: height * 0.07,
    marginHorizontal: width * 0.05,
    textAlign: "center",
  },
  thirdSubtitle: {
    fontSize: width * 0.055,
    marginBottom: height * 0.02,
    marginHorizontal: width * 0.05,
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    top: height * 0.05,
    left: width * 0.05,
  },
  imageFirstStep: {
    width: width * 0.9,
    height: height * 0.25,
    marginTop: height * 0.02,
    resizeMode: "contain",
  },
  imageThirdStep: {
    width: width * 0.6,
    height: height * 0.3,
    marginTop: 0,
    resizeMode: "contain",
  },
});