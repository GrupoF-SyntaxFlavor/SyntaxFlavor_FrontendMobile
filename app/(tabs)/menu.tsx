import React from 'react';
import { View, Text, Image, Button, ScrollView, StyleSheet } from 'react-native';

export default function Menu() {
  const products = [
    { name: 'Onigiris de Atún', price: 'Bs. 25', image: 'https://ruta-imagen-1.png' },
    { name: 'Cheesecake de Uvas', price: 'Bs. 29', image: 'https://ruta-imagen-2.png' },
    { name: 'Agua de Rosas', price: 'Bs. 15', image: 'https://ruta-imagen-3.png' },
  ];

  return (
    <ScrollView style={styles.container}>
      {products.map((product, index) => (
        <View key={index} style={styles.product}>
          <Image source={{ uri: product.image }} style={styles.image} />
          <View style={styles.details}>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.price}>{product.price}</Text>
            <Button title="Agregar" onPress={() => {/* lógica para agregar al carrito */}} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  product: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  image: {
    width: 80,
    height: 80,
  },
  details: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    marginVertical: 5,
  },
});
