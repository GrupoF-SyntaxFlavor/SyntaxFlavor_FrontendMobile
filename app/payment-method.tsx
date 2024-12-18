import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router"; // Importamos el hook para acceder a los parámetros
import { createOrder } from "@/service/OrderService";
import { createBill } from "@/service/BillService"; // Importamos el nuevo endpoint
import { makeOrderPayload } from "@/lib/OrderUtils";
import { useCart } from "@/contexts/CartContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "@/contexts/UserContext";

export default function Payment() {
  const { cartItems, updateQuantity, removeFromCart, setCartItems, tableCode } = useCart();
  const { billName, nit } = useUser();
  const [selectedMethod, setSelectedMethod] = useState("QR"); // Estado para el método de pago seleccionado
  const { total = "0" } = useLocalSearchParams();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Botones de selección de método de pago */}
        <View style={styles.paymentMethods}>
          <TouchableOpacity
            style={[
              styles.methodButton,
              selectedMethod === "QR" && styles.activeMethod,
            ]}
            onPress={() => setSelectedMethod("QR")}
          >
            <Text style={styles.methodText}>Código QR</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.methodButton,
              selectedMethod === "Card" && styles.activeMethod,
            ]}
            onPress={() => setSelectedMethod("Card")}
          >
            <Text style={styles.methodText}>Tarjeta</Text>
          </TouchableOpacity>
        </View>

        {/* Vista del código QR si está seleccionado */}
        {selectedMethod === "QR" && (
          <Image
            source={require("../assets/images/qr_code.png")} // Cambia la ruta según tu carpeta
            style={styles.image}
          />
        )}
        {/* Vista de detalles del usuario */}
        <View style={[styles.card, styles.userDetails]}>
          <View style={styles.detailRow}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="black"
            />
            <Text style={styles.detailText}>
              {billName ? billName : "Nombre no proporcionado"}{" "}
              {/* Valor predeterminado */}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="pricetag-outline" size={24} color="black" />
            <Text style={styles.detailText}>
              {nit ? nit : "NIT/CI no proporcionado"}{" "}
              {/* Valor predeterminado */}
            </Text>
          </View>
        </View>

        {/* Total */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total:</Text>
          <Text style={styles.totalAmount}>Bs. {total}</Text>
        </View>

        {/* Botón de "Pedir" */}
        <TouchableOpacity
          style={styles.orderButton}
          onPress={() => {
            console.log("pressed pay button");
            Alert.alert(
              "Confirmar pedido",
              "¿Estás seguro de que deseas realizar el pedido?",
              [
                {
                  text: "Cancelar",
                  onPress: () => console.log("Prompt cancelled"),
                  style: "cancel",
                },
                {
                  text: "OK",
                  onPress: async () => {
                    console.log("cartitems", cartItems);
                    // Create the order
                    const orderPayload = makeOrderPayload(cartItems, tableCode);
                    console.log("makeorderpayload", orderPayload);
                    try {
                      // Create the order
                      const orderResponse = await createOrder(orderPayload);
                      console.log("Order response:", orderResponse);

                      if (!orderResponse.payload.orderId) {
                        throw new Error("Order ID is missing in the response");
                      }

                      // Ensure billName and nit are strings
                      const billNameString = Array.isArray(billName)
                        ? billName.join(", ")
                        : billName;
                      const nitString = Array.isArray(nit)
                        ? nit.join(", ")
                        : nit;

                      // Create the bill
                      const billPayload = {
                        orderId: orderResponse.payload.orderId,
                        billName: billNameString || "Nombre no proporcionado",
                        nit: nitString || "NIT/CI no proporcionado",
                        totalCost: 104, // Reemplaza esto con el cálculo real del costo total
                      };
                      const billResponse = await createBill(billPayload);
                      console.log("Bill response:", billResponse);

                      Alert.alert(
                        "Pedido realizado",
                        "Tu pedido ha sido registrado exitosamente."
                      );

                      // Clear the cart
                      setCartItems([]);
                      await AsyncStorage.removeItem("cartItems");

                      // Redirect user to the home page
                      router.push("/(tabs)/menu");
                    } catch (error) {
                      console.error("Error creating order or bill:", error);
                      Alert.alert(
                        "Error",
                        "Hubo un error al registrar tu orden. intenta nuevamente."
                      );
                    }
                  },
                },
              ]
            );
          }}
        >
          <Text style={styles.orderButtonText}>Pedir</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  paymentMethods: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  methodButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginHorizontal: 10,
  },
  activeMethod: {
    backgroundColor: "#D1E4DE",
  },
  methodText: {
    fontSize: 16,
  },
  qrContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  userDetails: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 10,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2, // Para sombra en Android
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 16,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderTopWidth: 2,
    borderColor: "#ddd",
  },
  totalText: {
    fontSize: 23,
    fontWeight: "bold",
  },
  totalAmount: {
    fontSize: 23,
    fontWeight: "bold",
  },
  orderButton: {
    backgroundColor: "#86AB9A",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  orderButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  image: {
    width: "80%", // La imagen ocupará el 80% del ancho del contenedor
    height: undefined, // Altura automática para mantener la proporción
    aspectRatio: 1, // Mantiene la proporción de la imagen (1:1 para cuadrado)
    resizeMode: "contain", // Contiene la imagen dentro del área sin distorsión
    alignSelf: "center", // Asegura que esté centrada en su contenedor
  },
});
