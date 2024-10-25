import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { fetchMenuItems } from "@/service/MenuService";
import Loader from "@/components/Loader";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCart } from "@/contexts/CartContext";
import { router } from "expo-router";
import { Product } from "@/models/Product";
import Slider from "@react-native-community/slider";

export default function Menu() {
  const [fetchedProducts, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { cartItems, addToCart, menuItems, setMenuItems } = useCart();
  const navigation = useNavigation();

  // Parameters for fetching menu items
  const [minPrice, setMinPrice] = useState(10);
  const [maxPrice, setMaxPrice] = useState(20);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sortAscending, setSortAscending] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Menú");

  // Temporary state for sliders
  const [tempMinPrice, setTempMinPrice] = useState(minPrice);
  const [tempMaxPrice, setTempMaxPrice] = useState(maxPrice);

  // Load menu items on component mount
  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        setLoading(true);
        const items = await fetchMenuItems(minPrice, maxPrice, pageNumber, pageSize, sortAscending);
        console.log("Fetched products:", items);
        setMenuItems(items); // Set the fetched menu items in the cart context
      } catch (error) {
        console.error("Error loading menu items:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMenuItems();
  }, [minPrice, maxPrice, pageNumber, pageSize, sortAscending]);

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
    setMinPrice(tempMinPrice);
    setMaxPrice(tempMaxPrice);
    setPageNumber(0); // Reset to the first page
  };

  const loadMoreItems = async (nextPage) => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const items = await fetchMenuItems(minPrice, maxPrice, nextPage, pageSize, sortAscending);
      setMenuItems(items);
      setPageNumber(nextPage);
    } catch (error) {
      console.error("Error loading more menu items:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleNextPage = () => {
    loadMoreItems(pageNumber + 1);
  };

  const handlePreviousPage = () => {
    if (pageNumber > 0) {
      loadMoreItems(pageNumber - 1);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <View style={styles.filterContainer}>
            <TouchableOpacity onPress={toggleSortOrder} style={styles.sortButton}>
              <Ionicons
                name={sortAscending ? "arrow-up" : "arrow-down"}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>Precio mínimo: {tempMinPrice}</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={50}
              step={1}
              value={tempMinPrice}
              onValueChange={setTempMinPrice}
              minimumTrackTintColor="#86AB9A"
              maximumTrackTintColor="#000000"
              thumbTintColor="#86AB9A"
            />
            <Text style={styles.sliderLabel}>Precio máximo: {tempMaxPrice}</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={50}
              step={1}
              value={tempMaxPrice}
              onValueChange={setTempMaxPrice}
              minimumTrackTintColor="#86AB9A"
              maximumTrackTintColor="#000000"
              thumbTintColor="#86AB9A"
            />
            <TouchableOpacity onPress={applyPriceFilter} style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Aplicar filtros de precio</Text>
            </TouchableOpacity>
          </View>

          <ScrollView>
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
            <TouchableOpacity
              onPress={handlePreviousPage}
              style={[styles.paginationButton, pageNumber === 0 && styles.disabledButton]}
              disabled={pageNumber === 0}
            >
              <Text style={styles.paginationButtonText}>Anterior</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNextPage} style={styles.paginationButton}>
              <Text style={styles.paginationButtonText}>Siguiente</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Set the background color to white
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
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 10,
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
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
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
    padding: 10,
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

export default Menu;