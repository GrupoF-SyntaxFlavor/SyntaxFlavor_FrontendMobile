import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { fetchMenuItems } from "@/service/MenuService";
import Loader from "@/components/Loader";
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCart } from "@/contexts/CartContext";
import { router } from "expo-router";

interface ProductDB {
  id: number;
  name: string;
  description: string;
  price: number;
  // image: string;
}
interface ProductFront {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
}

export default function Menu() {
  var [fetchedProducts, setProducts] = useState<ProductDB[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Menú");
  const [loading, setLoading] = useState(true);
  const { cartItems, addToCart } = useCart();
  var { menuItems, setMenuItems } = useCart();
  var [adaptedProducts, setAdaptedProducts] = useState<ProductFront[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        setLoading(true);
        fetchedProducts = await fetchMenuItems();
        setProducts(fetchedProducts); // Actualizamos el estado con los productos obtenidos
        adaptedProducts = fetchedProducts.map((product) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          image:
            "https://images.pond5.com/pixel-sushi-vector-illustration-isolated-illustration-155825087_iconm.jpeg", // Asigna un valor adecuado o vacío si no tienes una imagen
          quantity: 10000, // Asigna un valor inicial adecuado
        }));
        setMenuItems(adaptedProducts); // Actualizamos el estado global con los productos obtenidos
      } catch (error) {
        console.error("Error loading menu items:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMenuItems();

    // Retorno vacío para evitar el error
    return undefined;
  }, []);

  const categories = [
    { label: "Menú", icon: "restaurant" },
    { label: "Más vendidos" },
    { label: "Precio más bajo primero" },
    { label: "Vegano" },
    { label: "Sin gluten" },
  ];

  const handleProductPress = (product: ProductFront) => {
    // Navegamos a 'menu-item' y pasamos los datos del producto como query params
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

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        // Si está cargando, muestra el ActivityIndicator
        <Loader />
      ) : (
        // Si ya no está cargando, muestra el contenido
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryBar}
          >
            {categories.map((category, index) => (
              <TouchableOpacity key={index} style={styles.categoryButton}>
                {category.icon && (
                  <Ionicons
                    name={category.icon as any}
                    size={10}
                    color="#666"
                    style={{ marginRight: 5 }}
                  />
                )}
                <Text style={styles.categoryText}>{category.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView>
            {menuItems.map((product, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleProductPress(product)}
              >
                <View style={styles.card}>
                  <View style={styles.cardContent}>
                    <View style={styles.textContainer}>
                      <Text style={styles.title}>{product.name}</Text>
                      <Text style={styles.description}>
                        {product.description}
                      </Text>
                      <Text style={styles.price}>Bs. {product.price}</Text>
                    </View>
                    <Image
                      source={{ uri: product.image }}
                      style={styles.image}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => product.quantity > 0 && addToCart(product)}
                    disabled={product.quantity <= 0}
                  >
                    <Text style={styles.addButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
}

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
    position: "relative", // Para que el botón se posicione dentro de la tarjeta
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
  // categorias
  categoryBar: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    maxHeight: "13%",
    flexWrap: "wrap",
    marginBottom: 10, // Agrega un margen inferior para crear espacio entre las categorías y el contenido del menú
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
});
