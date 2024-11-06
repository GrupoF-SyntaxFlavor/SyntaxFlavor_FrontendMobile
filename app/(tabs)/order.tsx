import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView, ActivityIndicator, PermissionsAndroid } from "react-native";
import { DataTable } from 'react-native-paper';
import { Ionicons } from "@expo/vector-icons";
import { usePastOrders, PastOrderFilters } from "@/contexts/PastOrdersContext";
import {
  OrderStatusValues,
  OrderStatusLabels,
} from "@/constants/OrderStatusValues";
import { PastOrder } from "@/models/PastOrder";
import { useCart } from "@/contexts/CartContext";
import { orderToProducts } from "@/lib/OrderUtils";
import Loader from "@/components/Loader";
import { cancelOrder } from "@/service/OrderService";
import { formatImages } from "@/lib/ImageUtils";

const PastOrdersScreen = () => {
  const { pastOrders, loadPastOrders, totalPages } = usePastOrders();
  const { setCartItems, menuItems } = useCart();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filters, setFilters] = useState<PastOrderFilters>({ sortAscending: false });
  const [selectedCategory, setSelectedCategory] = useState("Pendiente");
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      
      const data = await loadPastOrders({ ...filters, pageNumber, pageSize });
      setLoading(false);
    };

    fetchOrders();
  }, [filters, pageNumber, pageSize]);

  const toggleSortOrder = () => {
    setFilters((prev) => ({ ...prev, sortAscending: !prev.sortAscending }));
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setFilters((prev) => ({ ...prev, status: category }));
  };

  const handleRefreshOrder = (order: PastOrder) => {
    const products = formatImages(orderToProducts(order));
    setCartItems(products);

    Alert.alert(
      "Carrito actualizado",
      "Los productos de la orden seleccionada han sido añadidos al carrito"
    );
  };

  const handleCancelOrder = (order: PastOrder) => {
    Alert.alert(
      "Cancelar orden",
      "¿Está seguro que desea cancelar esta orden?",
      [
        {
          text: "Sí",
          onPress: async () => {
            try {
              await cancelOrder(order.orderId);
              Alert.alert(
                "Orden cancelada",
                "La orden ha sido cancelada, apersónate por caja para solicitar un reembolso"
              );
              await loadPastOrders(filters);
            } catch (error) {
              Alert.alert(
                "No se pudo cancelar la orden",
                "En este momento la orden no puede ser cancelada, por favor intente más tarde"
              );
            }
          },
        },
        {
          text: "No",
          style: "cancel",
        },
      ]
    );
  };

  const calculateTotal = (order: PastOrder) =>
    order.orderItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);

  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

  if (loading) {
    return <Loader />;
  }

  const categories = [
    { label: "Pendiente", value: "Pendiente" },
    { label: "Entregado", value: "Entregado" },
    { label: "Cancelado", value: "Cancelado" },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryBar}
      >
        <TouchableOpacity onPress={toggleSortOrder} style={styles.sortButton}>
          <Ionicons
            name={filters.sortAscending ? "arrow-up" : "arrow-down"}
            size={24}
            color="#666"
          />
        </TouchableOpacity>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.categoryButton,
              selectedCategory === category.value && styles.selectedCategoryButton,
            ]}
            onPress={() => handleCategorySelect(category.value)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.value && styles.selectedCategoryText,
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {pastOrders.length === 0 ? (
        <View style={styles.noOrdersFound}>
          <Text style={styles.noOrdersText}>
            No se encontraron órdenes
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.containerCard}>
          {pastOrders.map((order, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>ORD-{order.orderId}</Text>
                <Text style={styles.orderDate}>
                  {new Date(order.orderTimestamp).toLocaleDateString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric',
                  })}
                </Text>
                {order.orderStatus === OrderStatusValues.PENDING ? (
                  <View style={styles.statusContainer}>
                    <Ionicons name="time-outline" size={20} color="#FFA500" />
                    <Text style={styles.pendingStatus}>
                      {OrderStatusLabels.PENDING}
                    </Text>
                  </View>
                ) : order.orderStatus === OrderStatusValues.DELIVERED ? (
                  <View style={styles.statusContainer}>
                    <Ionicons
                      name="checkmark-done-outline"
                      size={20}
                      color="green"
                    />
                    <Text style={styles.deliveredStatus}>
                      {OrderStatusLabels.DELIVERED}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.statusContainer}>
                    <Ionicons name="close-circle-outline" size={20} color="red" />
                    <Text style={styles.cancelledStatus}>
                      {OrderStatusLabels.CANCELLED}
                    </Text>
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
          {loadingMore && <ActivityIndicator size="large" color="#86AB9A" />}
        </ScrollView>
      )}

      <View style={styles.paginationContainer}>
        <DataTable>
          <DataTable.Pagination
            page={pageNumber}
            numberOfPages={totalPages}
            onPageChange={handlePageChange}
            label={`${pageNumber +1} de ${totalPages}`}
          />
        </DataTable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 10,
    backgroundColor: "#f7f7f7",
  },
  categoryBar: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    maxHeight: "10%",
    minHeight: "9%",
    flexWrap: "wrap",
    // marginBottom: 10,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    minHeight: 40,
    flexWrap: "wrap",
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
  sortButton: {
    justifyContent: "center",
    alignItems: "center",
    // paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 10,
  },

  containerCard: {
    padding: 10,
    
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
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // padding: 10,
    backgroundColor: "#fff",
  },
  paginationButton: {
    backgroundColor: "#86AB9A",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  paginationButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
});

export default PastOrdersScreen;