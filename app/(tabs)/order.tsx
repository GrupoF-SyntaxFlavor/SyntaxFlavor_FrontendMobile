import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { fetchPastOrders } from '@/service/OrderService';
import { PastOrder } from '@/models/PastOrder';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { usePastOrders } from '@/contexts/PastOrdersContext';
import { TouchableOpacity } from 'react-native';
import { OrderStatusValues, OrderStatusLabels } from '@/constants/OrderStatusValues';

const PastOrdersScreen = () => {
    const { pastOrders, loadPastOrders } = usePastOrders();

    /* const renderOrder = ({ item }: { item: PastOrder }) => {
        console.log("Rendering order:", item);
        return (
        <View style={styles.orderContainer}>
            <Text style={styles.orderDate}>{item.orderTimestamp}</Text>
            <Text style={styles.orderStatus}>{item.orderStatus}</Text>
                {item.orderItems.map((product) => (
                    <View style={styles.productContainer}>
                    <Text>{product.menuItemName}</Text>
                    <Text>{product.quantity}</Text>
                </View>
                ))}
        </View>
    ) }; */

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
                  ) : (
                    <View style={styles.statusContainer}>
                      <Ionicons name="checkmark-done-outline" size={20} color="green" />
                      <Text style={styles.deliveredStatus}>{OrderStatusLabels.DELIVERED}</Text>
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
                  {/* TODO: get order total */}
                <Text style={styles.total}>Total: Bs. 0</Text>
    
                {order.orderStatus === OrderStatusValues.DELIVERED && (
                  <TouchableOpacity style={styles.refreshButton}>
                    <Ionicons name="refresh-outline" size={20} color="#000" />
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
});

export default PastOrdersScreen;