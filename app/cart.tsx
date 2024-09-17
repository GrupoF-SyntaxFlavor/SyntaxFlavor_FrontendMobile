import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router'; // Importa router

const initialProducts = [
  { id: '1', name: 'Promo patito', price: 'Bs. 20', quantity: 1, image: 'https://via.placeholder.com/100' },
  { id: '2', name: 'Promo caldito', price: 'Bs. 21', quantity: 1, image: 'https://via.placeholder.com/100' },
];

export default function CartScreen() {
  const [products, setProducts] = useState(initialProducts);
  const colorScheme = useColorScheme();
  const router = useRouter(); // Obtén el router

  const updateQuantity = (id: string, delta: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, quantity: Math.max(0, product.quantity + delta) } : product
      )
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productContainer}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.price}</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.id, -1)}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.id, 1)}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {}}
            >
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={styles.payButtonContainer}>
        <TouchableOpacity
          style={[styles.payButton, { backgroundColor: colorScheme === 'dark' ? '#000' : Colors[colorScheme ?? 'light'].tint }]}
          onPress={() => {  
            // Navigate to the payment form
            router.push('/invoice-form');

          }} 
        >
          <Text style={[styles.payButtonText, { color: colorScheme === 'dark' ? '#fff' : Colors[colorScheme ?? 'light'].background }]}>Ir a Pagar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  productContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  productImage: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantity: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  payButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  payButton: {
    width: '80%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});