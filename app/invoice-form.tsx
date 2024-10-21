import React, { useState, useEffect } from "react";
import { DataTable, Divider, TextInput, HelperText } from "react-native-paper";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";

export default function InvoiceScreen() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const { cartItems } = useCart();
  const { billName, nit, temporalBillName, temporalNIT, setTemporalNIT, setTemporalBillName, updateUserProfile, setUserProfile } = useUser();
  const [shouldUpdate, setShouldUpdate] = useState(false);

  useEffect(() => {
    // Fetch and set user profile data when the component mounts
    setUserProfile();
  }, [setUserProfile]);

  useEffect(() => {
    setTemporalBillName(billName);
    setTemporalNIT(nit);
  }, [billName, nit, setTemporalBillName, setTemporalNIT]);

  //Funciones para el nombre de la factura
  const onChangeBillName = (billName: string) => {
    setShouldUpdate(true); // Indica que los datos han sido modificados
    setTemporalBillName(billName); // Actualiza el estado del nombre de la factura
  }

  const hasErrorsBillName = () => {
    return !/^[a-zA-Z\s]+$/.test(temporalBillName); // Permite letras y espacios
  };

  //Funciones para el NIT o CI de la factura
  const onChangeNit = (nit: string) => {
    setShouldUpdate(true); // Indica que los datos han sido modificados
    setTemporalNIT(nit); // Actualiza el estado del NIT
  }
  const hasErrorsNit = () => {
    return !/^\d+$/.test(temporalNIT); // Retorna true si hay caracteres no numéricos
  };

  const hideDialog = () => setVisible(false);

  const handlePaymentPress = () => {
    if (hasErrorsBillName() || hasErrorsNit()) {
      setVisible(true); // Mostrar modal si hay errores
    } else {
      // Verificar si los datos han sido modificados
      if (shouldUpdate) {
        Alert.alert(
          "Guardar Datos", // <-- Título del Alert
          "¿Desea guardar los nuevos datos como predeterminados?",
          [
            {
              text: "No",
              onPress: () => proceedToPayment(),
              style: "cancel",
            },
            { text: "Sí", onPress: () => saveAndProceed() },
          ]
        );
      } else {
        proceedToPayment();
      }
    }
  };

  const saveAndProceed = async () => {
    try {
      // Llamar al servicio para actualizar los datos de facturación
      await updateUserProfile(temporalBillName, "billName");
      await updateUserProfile(temporalNIT, "ci");
      Alert.alert("Éxito", "Datos de facturación actualizados correctamente.");
      proceedToPayment(); // Proceder al pago después de guardar
    } catch (error) {
      console.error("Error al actualizar los datos de facturación:", error);
      Alert.alert(
        "Error",
        "Hubo un problema al actualizar los datos de facturación."
      );
    }
  };

  const proceedToPayment = () => {
    const total = calculateTotal(); // Calcular total
    router.push({
      pathname: "/payment-method",
      params: {
        billName: temporalBillName,
        nit: temporalNIT,
        total: total.toString(),
      },
    });
  };

  // Calcular el total por producto (cantidad * precio)
  const calculateTotal = (): number => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return parseFloat(total.toFixed(2)); // Redondea a 2 decimales y convierte a número
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }} // Ensure the KeyboardAvoidingView takes full height
    >
      <ScrollView style={styles.container}>
        {/* Título de la página */}
        {/* Tabla de productos seleccionados */}
        <View style={styles.card}>
          <Text style={styles.title}>Resumen</Text>
  
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Producto</DataTable.Title>
              <DataTable.Title numeric>Cantidad</DataTable.Title>
              <DataTable.Title numeric>Total</DataTable.Title>
            </DataTable.Header>
            {cartItems.map((item) => (
              <DataTable.Row key={item.id}>
                <DataTable.Cell style={{ flex: 2 }}>
                  <Text style={{ flexShrink: 1 }}>{item.name}</Text>
                </DataTable.Cell>
  
                <DataTable.Cell numeric>{item.quantity}</DataTable.Cell>
                <DataTable.Cell numeric>
                  {item.price * item.quantity}
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
          <Text style={styles.priceTotal}>Total: {calculateTotal()}</Text>
        </View>
  
        {/* Total de la compra */}
  
        {/* Espacio entre la tabla y el divisor */}
        <View style={{ marginBottom: 10 }}></View>
        <Divider />
        <View style={{ marginBottom: 10 }}></View>
  
        <Text style={styles.subtitle}>Datos de facturación</Text>
  
        {/* Nombre en la factura o razón social */}
        <View>
          <TextInput
            label="Nombre/ Razón Social"
            value={temporalBillName}
            onChangeText={onChangeBillName}
            theme={{ colors: { primary: "#86AB9A" } }} // Color verde para el borde y el foco
            style={styles.input} // Aplica el estilo desde el StyleSheet
          />
  
          <HelperText type="error" visible={hasErrorsBillName()}>
            El nombre debe contener sólo letras
          </HelperText>
        </View>
        {/* NIT o CI para la factura */}
        <View>
          <TextInput
            label="NIT/ CI"
            value={temporalNIT}
            onChangeText={onChangeNit}
            theme={{ colors: { primary: "#86AB9A" } }} // Color verde para el borde y el foco
            style={styles.input} // Aplica el estilo desde el StyleSheet
          />
          <HelperText type="error" visible={hasErrorsNit()}>
            El NIT/ CI debe contener sólo números
          </HelperText>
        </View>
        <Divider />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handlePaymentPress}
        >
          <Text style={styles.submitButtonText}>Método de Pago</Text>
        </TouchableOpacity>
        <Modal
          animationType="fade"
          transparent={true}
          visible={visible}
          onRequestClose={() => {
            setVisible(!visible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.subtitle}>Datos no válidos</Text>
              <Text style={styles.modalText}>
                Por favor, revise los datos ingresados
              </Text>
              <TouchableOpacity style={styles.modalButton} onPress={hideDialog}>
                <Text style={styles.modalButtonText}> Cerrar </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={{ marginBottom: 30 }}></View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20, // Un poco más de espacio
    backgroundColor: "#f7f7f7", // Fondo más claro y neutro
  },
  title: {
    fontSize: 26, // Un poco más grande para destacar
    fontWeight: "bold",
    textAlign: "center",
    color: "#333", // Un tono más oscuro para legibilidad
    marginBottom: 5, // Mayor separación con el contenido
  },
  card: {
    backgroundColor: "#fff", // Fondo blanco
    borderRadius: 10, // Bordes redondeados
    padding: 15, // Relleno interno
    shadowColor: "#000", // Sombra para dar efecto de tarjeta
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2, // Elevación en Android para la sombra
    marginBottom: 20, // Espacio inferior
  },
  subtitle: {
    fontSize: 22, // Un poco más grande
    fontWeight: "bold",
    textAlign: "center", // Alineación a la izquierda para una estructura más profesional
    color: "#333", // Mismo tono oscuro
    marginBottom: 15, // Mayor separación entre secciones
    marginTop: 10, // Separación del título anterior
  },
  priceTotal: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "right",
    marginTop: 15,
    marginBottom: 0,
    marginRight: 5,
  },
  submitButton: {
    backgroundColor: "#86AB9A", // Color más suave para que se integre bien con la aplicación
    paddingVertical: 15, // Aumentamos el relleno para hacerlo más clicable
    borderRadius: 10, // Bordes más redondeados para mayor suavidad
    alignItems: "center",
    marginTop: 20, // Espacio antes del botón
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#fff", // Fondo blanco
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo oscuro semitransparente
  },
  modalView: {
    margin: 10,
    backgroundColor: "#F0F0F2",
    borderRadius: 25,
    padding: 25,
    alignItems: "center",
    width: "85%",
  },
  modalText: {
    marginBottom: 16,
    fontSize: 17,
    textAlign: "center",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#86AB9A",
    borderRadius: 5,
    marginHorizontal: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});