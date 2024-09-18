import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router"; // Cambiar useSearchParams por SearchParams
import { Ionicons } from "@expo/vector-icons";

export default function MenuItem() {
  const router = useRouter(); // Para manejar el botón de "volver"

  // Aquí accedemos a los parámetros directamente
  const { productName, productPrice, productImage, productDescription } =
    useLocalSearchParams();

  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleRemove = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{productName}</Text>

      <Image
        source={{
          uri: Array.isArray(productImage) ? productImage[0] : productImage,
        }} // Aseguramos que sea string
        style={styles.image}
      />

      <Text style={styles.description}>{productDescription}</Text>

      <Text style={styles.price}>Bs. {productPrice}</Text>

      <View style={styles.addToOrderContainer}>
        <Text style={styles.addToOrderText}>Agregar a tu pedido</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={handleRemove}
          >
            <Ionicons name="remove" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.quantity}>{quantity}</Text>
          <TouchableOpacity style={styles.quantityButton} onPress={handleAdd}>
            <Ionicons name="add" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  image: {
    width: "100%",
    height: 275,
    borderRadius: 10,
    marginBottom: 20,
  },
  description: {
    fontSize: 20,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  addToOrderContainer: {
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingTop: 20,
  },
  addToOrderText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  quantityContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  quantityButton: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
  },
  quantity: {
    fontSize: 20,
    marginHorizontal: 15,
  },
  addButton: {
    backgroundColor: "#60A6A5",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
