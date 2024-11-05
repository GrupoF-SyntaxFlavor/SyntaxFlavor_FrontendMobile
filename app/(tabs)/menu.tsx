import React, { useState, useCallback } from 'react';
import { RefreshControl, ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { DataTable } from 'react-native-paper';
import { fetchMenuItems } from "@/service/MenuService";
import Loader from "@/components/Loader";
import { useCart } from "@/contexts/CartContext";
import { useNavigation } from "@react-navigation/native";
import { Product } from "@/models/Product";
import MultiSlider from '@ptomasroos/react-native-multi-slider';

export default function Menu() {
  const [refreshing, setRefreshing] = useState(false);
  const [fetchedProducts, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { cartItems, addToCart, menuItems, setMenuItems } = useCart();
  const navigation = useNavigation();

  // Refresh control handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Here you can place the logic to fetch or refresh the menu items
      const data = await fetchMenuItems(minPrice, maxPrice, pageNumber, pageSize, sortAscending);
      setMenuItems(data.content); // Update your state with the new items
    } catch (error) {
      console.error('Failed to refresh menu items:', error);
    }
    setRefreshing(false);
  }, [minPrice, maxPrice, pageNumber, pageSize, sortAscending]);

  return (
    <View style={styles.container}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>
              Precio: {priceRange[0]} - {priceRange[1]}
            </Text>
            <MultiSlider
              values={priceRange}
              min={0}
              max={50}
              step={1}
              onValuesChange={handleValuesChange}
              selectedStyle={{ backgroundColor: '#86AB9A' }}
              unselectedStyle={{ backgroundColor: '#000000' }}
              markerStyle={{ backgroundColor: '#86AB9A', height: 30, width: 30 }}
            />
            <View style={styles.buttonRowContainer}>
              <TouchableOpacity onPress={applyPriceFilter} style={styles.applyButton}>
                <Text style={styles.applyButtonText}>Aplicar filtro</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleSortOrder} style={styles.sortButton}>
                <FontAwesome
                  name={sortAscending ? "sort-alpha-asc" : "sort-alpha-desc"}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.divider} />
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#86AB9A" // You can customize the color of the refresh indicator
              />
            }
          >
            {menuItems.map((product, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  if (product.status) {
                    handleProductPress(product);
                  }
                }}
                disabled={!product.status}
              >
                <View style={[styles.card, !product.status && styles.disabledCard]}>
                  <View style={styles.cardContent}>
                    <View style={styles.textContainer}>
                      <Text style={styles.title}>{product.name}</Text>
                      <Text style={styles.description}>{product.description}</Text>
                      <Text style={styles.price}>Bs. {product.price}</Text>
                    </View>
                    <Image
                      source={{ uri: product.image || '' }}
                      style={styles.image}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                      if (product.status) {
                        addToCart(product);
                      }
                    }}
                    disabled={!product.status}
                  >
                    <Text style={styles.addButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
            {loadingMore && <ActivityIndicator size="large" color="#86AB9A" />}
          </ScrollView>

          <View style={styles.paginationContainer}>
            <DataTable>
              <DataTable.Pagination
                page={pageNumber}
                numberOfPages={totalPages}
                onPageChange={handlePageChange}
                label={`${pageNumber + 1} de ${totalPages}`}
              />
            </DataTable>
          </View>
        </>
      )}
    </View>
  );
}
