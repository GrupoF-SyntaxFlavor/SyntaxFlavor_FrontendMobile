import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { usePastOrders } from '@/contexts/PastOrdersContext';
import { TouchableOpacity } from 'react-native';
import { OrderStatusValues, OrderStatusLabels } from '@/constants/OrderStatusValues';
import { PastOrder } from '@/models/PastOrder';
import { useCart } from '@/contexts/CartContext';
import { orderToProducts } from '@/lib/OrderUtils';
import Loader from '@/components/Loader';
import { cancelOrder } from '@/service/OrderService';

const PastOrdersScreen = () => {
  const { pastOrders, loadPastOrders } = usePastOrders();
  const { setCartItems, menuItems } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      await loadPastOrders();
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const handleRefreshOrder = (order: PastOrder) => {
    const products = orderToProducts(order);
    // set the products images from the menuItems
    products.forEach(product => {
      const menuItem = menuItems.find(item => item.id === product.id);
      if (menuItem) {
        product.image = menuItem.image;
      }
    });
    setCartItems(products);

    // Show a temporary message (Toast) to indicate that the cart has been updated
    console.log('Carrito actualizado', 'Los productos de la orden seleccionada han sido añadidos al carrito');
    Alert.alert('Carrito actualizado', 'Los productos de la orden seleccionada han sido añadidos al carrito');
  };

  const handleCancelOrder = (order: PastOrder) => {
    // Show a confirmation dialog to cancel the order
    Alert.alert(
      'Cancelar orden',
      '¿Está seguro que desea cancelar esta orden?',
      [
        {
          text: 'Sí',
          onPress: async () => {
            try {
              await cancelOrder(order.orderId);
              console.log('Orden cancelada', 'La orden ha sido cancelada');
              Alert.alert('Orden cancelada', 'La orden ha sido cancelada, apersónate por caja para solicitar un reembolso');
              // Refresh the past orders list
              await loadPastOrders();
            } catch (error) {
              console.error('Error cancelando orden:', error);
              Alert.alert('No se pudo cancelar la orden', 'En este momento la orden no puede ser cancelada, por favor intente más tarde');
            }
          },
        },
        {
          text: 'No',
          style: 'cancel',
        },
      ]
    );
  }

  const calculateTotal = (order: PastOrder) => order.orderItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)


  if (loading) {
    return (
      <Loader />
    );
  }

  // If no past orders are found, show an empty view with a message
  if (!pastOrders.length) {
    return (
      <View style={styles.noOrdersFound}>
        <Text style={styles.noOrdersText}>No se encontraron órdenes anteriores</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {pastOrders.map((order, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>ORD-{order.orderId}</Text>
              {/* TODOFormat timestamp as MM-DD */}
              <Text style={styles.orderDate}>{order.orderTimestamp}</Text>
              {order.orderStatus === OrderStatusValues.PENDING ? (
                <View style={styles.statusContainer}>
                  <Ionicons name="time-outline" size={20} color="#FFA500" />
                  <Text style={styles.pendingStatus}>{OrderStatusLabels.PENDING}</Text>
                </View>
              ) : order.orderStatus === OrderStatusValues.DELIVERED ? (
                <View style={styles.statusContainer}>
                  <Ionicons name="checkmark-done-outline" size={20} color="green" />
                  <Text style={styles.deliveredStatus}>{OrderStatusLabels.DELIVERED}</Text>
                </View>
              ) : (
                <View style={styles.statusContainer}>
                  <Ionicons name="close-circle-outline" size={20} color="red" />
                  <Text style={styles.cancelledStatus}>{OrderStatusLabels.CANCELLED}</Text>
                </View>
              )}
            </View>

            <View style={styles.orderItems}>
              {order.orderItems.map((item, idx) => (
                <Text key={idx} style={styles.itemText}>
                  {item.quantity} x {item.menuItemName}
                </Text>
              ))}
            </View>
            <Text style={styles.total}>Total: Bs. {calculateTotal(order)}</Text>

            {order.orderStatus !== OrderStatusValues.PENDING ? (
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={() => handleRefreshOrder(order)}
              >
                <Ionicons name="refresh-outline" size={20} color="#000" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={() => handleCancelOrder(order)}
              >
                <Ionicons name="close-outline" size={20} color="red" />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

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
    marginVertical: 5,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    position: "relative",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "bold",
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  pendingStatus: {
    color: "#FFA500",
    marginLeft: 5,
  },
  deliveredStatus: {
    color: "green",
    marginLeft: 5,
  },
  cancelledStatus: {
    color: "red",
    marginLeft: 5,
  },
  orderItems: {
    marginTop: 5,
    marginBottom: 5,
  },
  itemText: {
    fontSize: 14,
    color: "#333",
  },
  total: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  refreshButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  noOrdersFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f7f7f7",
  },
  noOrdersText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default PastOrdersScreen;
