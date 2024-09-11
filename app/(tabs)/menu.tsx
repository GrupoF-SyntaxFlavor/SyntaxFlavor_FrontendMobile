import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function Menu() {
  const products = [
    { 
      name: 'Onigiris de Atún', 
      description: 'Deliciosos triángulos de arroz rellenos de atún fresco, sazonados con un toque de salsa de soya y envueltos en una capa de alga nori crujiente.', 
      price: 25,
      image: 'https://images.pond5.com/pixel-sushi-vector-illustration-isolated-illustration-155825087_iconm.jpeg'
    },
    // Puedes agregar más productos aquí
    {name: 'Cheesecake de Uvas', description: 'Un postre delicioso y fresco, perfecto para cualquier ocasión.', price: 30, image: 'https://images.pond5.com/pixel-sushi-vector-illustration-isolated-illustration-155825087_iconm.jpeg'},
    {name: 'Tacos de Pollo', description: 'Tacos de pollo con guacamole y salsa de chipotle.', price: 40, image: 'https://images.pond5.com/pixel-sushi-vector-illustration-isolated-illustration-155825087_iconm.jpeg'},
    {name: 'Pizza de Pepperoni', description: 'Pizza de pepperoni con queso mozzarella y salsa de tomate.', price: 50, image: 'https://images.pond5.com/pixel-sushi-vector-illustration-isolated-illustration-155825087_iconm.jpeg'},
    {name: 'Hamburguesa Clásica', description: 'Hamburguesa con carne de res, lechuga, tomate, cebolla y queso cheddar.', price: 35, image: 'https://images.pond5.com/pixel-sushi-vector-illustration-isolated-illustration-155825087_iconm.jpeg'},
    {name: 'Té Helado', description: 'Té helado de limón, perfecto para refrescarte en un día caluroso.', price: 15, image: 'https://images.pond5.com/pixel-sushi-vector-illustration-isolated-illustration-155825087_iconm.jpeg'},
    {name: 'Pastel de Chocolate', description: 'Un pastel de chocolate esponjoso y delicioso, perfecto para los amantes del chocolate.', price: 30, image: 'https://images.pond5.com/pixel-sushi-vector-illustration-isolated-illustration-155825087_iconm.jpeg'},
  ];

  return (
    <ScrollView style={styles.container}>
      {products.map((product, index) => (
        <View key={index} style={styles.card}>
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
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    position: 'relative',  // Para que el botón se posicione dentro de la tarjeta
  },
  cardContent: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  textContainer: {
    flex: 3,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 100,  // Aumenta el tamaño de la imagen
    height: 100,  // Aumenta el tamaño de la imagen
    borderRadius: 50,  // Sigue siendo redonda
  },
  addButton: {
    position: 'absolute',
    top: 10,  // Posiciona el botón en la parte superior
    right: 10,  // Posiciona el botón en la esquina derecha
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
