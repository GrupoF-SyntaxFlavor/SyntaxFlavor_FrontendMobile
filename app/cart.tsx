import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useCart } from '@/contexts/CartContext';
import { router } from 'expo-router';

export default function CartScreen() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <Text style={styles.emptyCartText}>No tienes productos en el carrito</Text>
        </View>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>Bs. {item.price}</Text>
                <View style={styles.quantityContainer}>
                  {item.quantity > 1 ? (
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, -1)}
                    >
                      <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => removeFromCart(item.id)}
                    >
                      <Ionicons name="trash-outline" size={24} color="red" />
                    </TouchableOpacity>
                  )}
                  <Text style={styles.quantity}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateQuantity(item.id, 1)}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      )}
      <View style={styles.payButtonContainer}>
        <TouchableOpacity
          style={[
            styles.payButton,
            {
              backgroundColor: cartItems.length === 0 ? '#ccc' : (colorScheme === 'dark' ? '#000' : Colors[colorScheme ?? 'light'].tint),
            },
          ]}
          onPress={() => {
            if (cartItems.length > 0) {
              // Navigate to the payment form
              router.push('/invoice-form');
            }
          }}
          disabled={cartItems.length === 0}
        >
          <Text
            style={[
              styles.payButtonText,
              { color: cartItems.length === 0 ? '#888' : (colorScheme === 'dark' ? '#fff' : Colors[colorScheme ?? 'light'].background) },
            ]}
          >
            Ir a Pagar
          </Text>
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
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 18,
    color: '#666',
  },
  card: {
    flexDirection: 'row',
    padding: 10,
    margin: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  productDetails: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
    color: '#888',
    marginVertical: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityButton: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantity: {
    marginHorizontal: 20,
    fontSize: 18,
  },
  payButtonContainer: {
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  payButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});