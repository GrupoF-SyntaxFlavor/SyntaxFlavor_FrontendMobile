import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { fetchPastOrders } from '@/service/OrderService';
import { PastOrder } from '@/models/PastOrder';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';

const PastOrdersScreen = ({ customerId }: { customerId: number }) => {
    const [pastOrders, setPastOrders] = useState<PastOrder[]>([]);

    useEffect(() => {
        const loadPastOrders = async () => {
            const mockId = 1;
            try {
                console.log("Loading past orders for customer:", mockId);
                const orders = await fetchPastOrders(mockId);
                console.log("Past orders loaded:", orders);
                setPastOrders(orders);
            } catch (error) {
                console.error("Error loading past orders:", error);
            }
        };

        loadPastOrders();
    }, [customerId]);

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
            <Ionicons name="mail-outline" size={26} color="#86AB9A" />
            {pastOrders.length === 0 ? (
            <Text>No orders found</Text>
            ) : (
            <ScrollView>
                {pastOrders.map((order) => (
                <View key={order.orderId}>
                    <Text>{order.orderTimestamp}</Text>
                    <Text>{order.orderStatus}</Text>
                    {order.orderItems.map((product) => (
                    <View key={product.menuItemId}>
                        <Text>{product.menuItemName}</Text>
                        <Text>{product.quantity}</Text>
                    </View>
                    ))}
                </View>
                ))}
            </ScrollView>
                
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    orderContainer: {
        marginBottom: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
    },
    orderDate: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    orderStatus: {
        fontSize: 14,
        color: 'gray',
    },
    productContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
});

export default PastOrdersScreen;