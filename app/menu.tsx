import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router"; // Usamos el hook para manejar la navegación

interface Product {
  name: string;
  description: string;
  price: number;
  image: string;
}
export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState("Menú");

  const products = [
    {
      name: "Onigiris de Atún",
      description:
        "Deliciosos triángulos de arroz rellenos de atún fresco, sazonados con un toque de salsa de soya y envueltos en una capa de alga nori crujiente.",
      price: 25,
      image:
        "https://images.pond5.com/pixel-sushi-vector-illustration-isolated-illustration-155825087_iconm.jpeg",
    },
    // Agregar más productos aquí
    {
      name: "Cheesecake de Uvas",
      description:
        "Un postre delicioso y fresco, perfecto para cualquier ocasión.",
      price: 30,
      image:
        "https://assets.tmecosys.com/image/upload/t_web767x639/img/recipe/vimdb/230649.jpg",
    },
    {
      name: "Tacos de Pollo",
      description: "Tacos de pollo con guacamole y salsa de chipotle.",
      price: 40,
      image:
        "https://www.vvsupremo.com/wp-content/uploads/2017/06/Chicken-Tacos-900x570-sRGB.jpg",
    },
    {
      name: "Pizza de Pepperoni",
      description: "Pizza de pepperoni con queso mozzarella y salsa de tomate.",
      price: 50,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIoXjS-sXqWGIsMTB_m3av-Oh-Fgi93hBrzg&s",
    },
    {
      name: "Hamburguesa Clásica",
      description:
        "Hamburguesa con carne de res, lechuga, tomate, cebolla y queso cheddar.",
      price: 35,
      image:
        "https://img.freepik.com/fotos-premium/foto-stock-hamburguesa-clasica-aislada-blanco_940723-217.jpg",
    },
    {
      name: "Té Helado",
      description:
        "Té helado de limón, perfecto para refrescarte en un día caluroso.",
      price: 15,
      image: "https://imag.bonviveur.com/te-helado.jpg",
    },
    {
      name: "Pastel de Chocolate",
      description:
        "Un pastel de chocolate esponjoso y delicioso, perfecto para los amantes del chocolate.",
      price: 30,
      image:
        "https://i.pinimg.com/736x/42/36/b1/4236b10d070cb898106d84a6f2fa4a2c.jpg",
    },
  ];

  const categories = [
    { label: "Menú", icon: "restaurant" },
    { label: "Más vendidos" },
    { label: "Precio más bajo primero" },
    { label: "Vegano" },
    { label: "Sin gluten" },
  ];

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
  };

  const handleProductPress = (product: any) => {
    // Navegamos a 'menu-item' y pasamos los datos del producto como query params
    router.push({
      pathname: "/menu-item",
      params: {
        productName: product.name,
        productPrice: product.price,
        productImage: product.image,
        productDescription: product.description,
      },
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryBar}
      >
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.categoryButton,
              selectedCategory === category.label &&
                styles.selectedCategoryButton,
            ]}
            onPress={() => handleCategoryPress(category.label)}
          >
            {category.icon && (
              <Ionicons
                name={category.icon as any}
                size={10}
                color={selectedCategory === category.label ? "#000" : "#666"}
                style={{ marginRight: 5 }}
              />
            )}
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.label &&
                  styles.selectedCategoryText,
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/*  */}
      <ScrollView style={styles.container}>
        {products.map((product, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleProductPress(product)}
          >
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{product.name}</Text>
                  <Text style={styles.description}>{product.description}</Text>
                  <Text style={styles.price}>Bs. {product.price}</Text>
                </View>
                <Image source={{ uri: product.image }} style={styles.image} />
              </View>
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f7f7f7",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    position: "relative", // Para que el botón se posicione dentro de la tarjeta
  },
  cardContent: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  textContainer: {
    flex: 3,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
  },
  image: {
    width: 100, // Aumenta el tamaño de la imagen
    height: 100, // Aumenta el tamaño de la imagen
    borderRadius: 50, // Sigue siendo redonda
  },
  addButton: {
    position: "absolute",
    top: 10, // Posiciona el botón en la parte superior
    right: 10, // Posiciona el botón en la esquina derecha
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#60A6A5",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  // categorias
  categoryBar: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    maxHeight: "10%",
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    // maxHeight: '10%',
  },
  selectedCategoryButton: {
    backgroundColor: "#d1e4de",
    borderColor: "#000",
  },
  categoryText: {
    fontSize: 14,
    color: "#666",
  },
  selectedCategoryText: {
    fontWeight: "bold",
    color: "#000",
  },
  // menuContainer: {
  //   flex: 1,
  //   padding: 10,
  //   backgroundColor: '#fff',
  // },
});
