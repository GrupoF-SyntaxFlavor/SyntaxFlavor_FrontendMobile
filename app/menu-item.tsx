import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router"; // Cambiar useSearchParams por SearchParams
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "@/contexts/CartContext";

export default function MenuItem() {
  const router = useRouter(); // Para manejar el botón de "volver"
  const { addToCart } = useCart(); // Para agregar al carrito

  // Aquí accedemos a los parámetros directamente
  const { productId, productName, productPrice, productImage, productDescription } =
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

  const handleAddToCart = () => {
    const product = {
      id: Number(productId),
      name: Array.isArray(productName) ? productName[0] : productName,
      price: Number(productPrice),
      image: Array.isArray(productImage) ? productImage[0] : productImage,
      description: Array.isArray(productDescription) ? productDescription[0] : productDescription,
      quantity: 1, // Siempre 1 porque se agregará en un bucle
      status: true, // Siempre true porque se agregará en un bucle
    };

    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>{Array.isArray(productName) ? productName[0] : productName}</Text>

          <Image
            source={{
              uri: Array.isArray(productImage) ? productImage[0] : productImage,
            }} // Aseguramos que sea string
            style={styles.image}
          />

          <Text style={styles.description}>{Array.isArray(productDescription) ? productDescription[0] : productDescription}</Text>

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
            <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
              <Text style={styles.addButtonText}>Agregar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
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