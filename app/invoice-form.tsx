import React, { useState } from "react";
import { DataTable, Divider, TextInput, HelperText } from "react-native-paper";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";

export default function InvoiceScreen() {
  const router = useRouter();

  const handlePaymentPress = () => {
    router.push({
      pathname: "/payment-method",
      params: {
        billName: billName,
        nit: nit,
      },
    });
  };

  const [items] = React.useState([
    {
      id: 1,
      name: "Cupcake",
      price: 356,
      quantity: 16,
    },
    {
      id: 2,
      name: "Eclair",
      price: 262,
      quantity: 16,
    },
    {
      id: 3,
      name: "Frozen yogurt",
      price: 159,
      quantity: 6,
    },
    {
      id: 4,
      name: "Gingerbread",
      price: 305,
      quantity: 3.7,
    },
  ]);
  // Lista de productos seleccionados
  const [products, setProducts] = useState(items);
  //Campo para el nombre de la factura
  const [billName, setBillName] = React.useState("Doe");
  //Campo para el NIT o CI de la factura
  const [nit, setNit] = React.useState("123456");

  //Funciones para el nombre de la factura
  const onChangeBillName = (billName: React.SetStateAction<string>) =>
    setBillName(billName);
  const hasErrorsBillName = () => {
    return !/^[a-zA-Z]+$/.test(billName); // Retorna true si hay caracteres que no son letras
  };

  //Funciones para el NIT o CI de la factura
  const onChangeNit = (nit: React.SetStateAction<string>) => setNit(nit);
  const hasErrorsNit = () => {
    return !/^\d+$/.test(nit); // Retorna true si hay caracteres no numéricos
  };

  // Calcular el total por producto (cantidad * precio)
  const calculateTotal = (): number => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
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
          {products.map((item) => (
            <DataTable.Row key={item.id}>
              <DataTable.Cell>{item.name}</DataTable.Cell>
              <DataTable.Cell numeric>{item.quantity}</DataTable.Cell>
              <DataTable.Cell numeric>
                {item.price * item.quantity}
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </View>

      {/* Total de la compra */}
      <Text style={styles.priceTotal}>Total: {calculateTotal()}</Text>

      {/* Espacio entre la tabla y el divisor */}
      <View style={{ marginBottom: 10 }}></View>
      <Divider />
      <View style={{ marginBottom: 10 }}></View>

      <Text style={styles.subtitle}>Datos de facturación</Text>

      {/* Nombre en la factura o razón social */}
      <View>
        <TextInput
          label="Nombre/ Razón Social"
          value={billName}
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
          value={nit}
          onChangeText={onChangeNit}
          theme={{ colors: { primary: "#86AB9A" } }} // Color verde para el borde y el foco
          style={styles.input} // Aplica el estilo desde el StyleSheet
        />
        <HelperText type="error" visible={hasErrorsNit()}>
          El NIT/ CI debe contener sólo números
        </HelperText>
      </View>
      {/* Espacio entre los datos y el divisor */}
      <View style={{ marginBottom: 10 }}></View>
      <Divider />
      <View style={{ marginBottom: 10 }}></View>
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handlePaymentPress}
      >
        <Text style={styles.submitButtonText}>Método de Pago</Text>
      </TouchableOpacity>
      <View style={{ marginBottom: 30 }}></View>
    </ScrollView>
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
    fontSize: 20, // Un poco más grande
    fontWeight: "bold",
    textAlign: "left", // Alineación a la izquierda para una estructura más profesional
    color: "#333", // Mismo tono oscuro
    marginBottom: 15, // Mayor separación entre secciones
  },
  priceTotal: {
    fontSize: 20, // Tamaño mayor para destacar el total
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 10, // Más espacio para resaltar
    marginRight: 15,
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
    marginBottom: 15, // Espacio entre los inputs
  },
});
