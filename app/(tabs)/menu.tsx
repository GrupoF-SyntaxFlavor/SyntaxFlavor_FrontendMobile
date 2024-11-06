import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState, useCallback } from "react";
import { DataTable } from 'react-native-paper';
import { fetchMenuItems } from "@/service/MenuService";
import { FontAwesome } from '@expo/vector-icons';
import { formatImages } from "@/lib/ImageUtils";

import Loader from "@/components/Loader";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCart } from "@/contexts/CartContext";
import { router } from "expo-router";
import { Product } from "@/models/Product";
import MultiSlider from '@ptomasroos/react-native-multi-slider';

export default function Menu() {
  const [fetchedProducts, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { cartItems, addToCart, menuItems, setMenuItems } = useCart();
  const navigation = useNavigation();

  // Parameters for fetching menu items
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100);
  const [priceRange, setPriceRange] = useState([0, 100]);

  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sortAscending, setSortAscending] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Todo");

  // Temporary state for sliders
  const [tempMinPrice, setTempMinPrice] = useState(minPrice);
  const [tempMaxPrice, setTempMaxPrice] = useState(maxPrice);

  // Pagination state
  const [totalPages, setTotalPages] = useState(0);

  //Estado de actualizacion
  const [refreshing, setRefreshing] = useState(false);

  //ocultar slider
  const [showPriceSlider, setShowPriceSlider] = useState(false);


  // Load menu items on component mount and on pull to refresh
  const loadMenuItems = useCallback(async () => {
    // setLoading(true);
    try {
      const data = await fetchMenuItems(minPrice, maxPrice, pageNumber, pageSize, sortAscending);
      console.log("data: ", data);
      setMenuItems(formatImages(data.content)); // Set the fetched menu items in the cart context
      setTotalPages(data.totalPages); // Set the total pages for pagination
    } catch (error) {
      console.error("Error loading menu items:", error);
    } finally {
      setLoading(false);
    }
  }, [minPrice, maxPrice, pageNumber, pageSize, sortAscending]);

  useEffect(() => {
    loadMenuItems();
    // const intervalId = setInterval(() => {
    //   loadMenuItems(); // Reload items every X milliseconds
    // }, 5000); // 5000 ms = 5 seconds

    // return () => clearInterval(intervalId);
  }, [loadMenuItems]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // setLoading(true);
    await loadMenuItems();
    setRefreshing(false);
    // setLoading(false);
  }, [loadMenuItems]);
  

  const handleValuesChange = (values: number[]) => {
    setPriceRange(values);
    setMinPrice(minPrice);
    setMaxPrice(maxPrice);
  };

  const handleProductPress = (product: Product) => {
    router.push({
      pathname: "/menu-item",
      params: {
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        productImage: product.image,
        productDescription: product.description,
      },
    });
  };

  const toggleSortOrder = () => {
    setSortAscending((prev) => !prev);
  };

  const applyPriceFilter = () => {
    if (showPriceSlider) {
      const [min, max] = priceRange;
      setMinPrice(min);
      setMaxPrice(max);
      setPageNumber(0); // Reset to the first page
      setShowPriceSlider(false); // Optional: Hide the slider after applying the filter
    }
  };
  

  const loadMoreItems = async (nextPage: number) => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const data = await fetchMenuItems(minPrice, maxPrice, nextPage, pageSize, sortAscending);
      setMenuItems(data.content);
      setPageNumber(nextPage);
      setTotalPages(data.totalPages); // Update total pages
    } catch (error) {
      console.error("Error loading more menu items:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

  const categories = [
    { label: "Todo", value: "Todo" },
    { label: "Filtrar por precio", value: "Precio" },
  ];

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    if (category === "Precio") {
      setShowPriceSlider(!showPriceSlider);  // Toggle the visibility of the price slider
    } else if (category === "Todo") {
      setShowPriceSlider(false);  // Toggle the visibility of the price slider
      setMinPrice(0);
      setMaxPrice(100);
    } else{
      setShowPriceSlider(false);  // Hide the slider if another category is selected
    }
  };
  

  return (
    <View style={styles.container}>
      {loading ? (
        <Loader />
      ) : (
        <>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryBar}
          >
            <TouchableOpacity onPress={toggleSortOrder} style={styles.sortButtonCategory}>
              <FontAwesome
                name={sortAscending ? "sort-alpha-asc" : "sort-alpha-desc"}
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
          
          {showPriceSlider && (
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
          )}

          <View style={styles.divider} />
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {menuItems.map((product, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  if (product.status) {
                    handleProductPress(product); // Solo llama a la función si el producto está disponible
                  }
                }}
                disabled={!product.status}
              >
                <View style={[styles.card, !product.status && styles.disabledCard]}>
                  <View style={styles.cardContent}>
                    <View style={styles.textContainer}>
                      <Text style={styles.title}>{product.name}</Text>
                      <Text style={styles.description}>
                        {product.description}
                      </Text>
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
                        addToCart(product); // Solo llama a la función si el producto está disponible
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
                label={`${pageNumber +1} de ${totalPages}`}
              />
            </DataTable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7", // Set the background color to white
  },
  divider: {
    height: 1, // Ajusta el grosor de la línea
    backgroundColor: '#C0C0C0', // Color de la línea
    // marginVertical: 15, // Espaciado alrededor de la línea
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
    position: "relative", // Para que el botón se posicione dentro de la tarjeta
  },
  disabledCard: {
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 5,
    shadowColor: "#0000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    position: "relative",
    backgroundColor: '#D3D3D3', // Color gris
    opacity: 0.6, // Opacidad
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
    backgroundColor: "#86AB9A",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    top: 2,
    left: 1,
    fontSize: 24,
    fontWeight: "bold",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 2,
    paddingHorizontal: 8,
    backgroundColor: "#f9f9f9",
    borderBottomColor: "#ddd",
    marginBottom: 3,
  },
  buttonRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10, // opcional, para añadir un poco de espacio interno
    marginVertical: 10,    // opcional, para espaciar verticalmente el contenedor
  },
  sortButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    marginLeft: 10,
  },
  sliderContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  applyButton: {
    backgroundColor: "#86AB9A",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  applyButtonText: {
    color: "#fff",
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

  categoryBar: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    maxHeight: "10%",
    minHeight: "9%",
    flexWrap: "wrap",
    marginBottom: 10,
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
  sortButtonCategory: {
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
});