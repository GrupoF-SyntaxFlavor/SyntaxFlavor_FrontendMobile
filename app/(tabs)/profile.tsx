import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getCustomerProfile,
  updateCustomerProfile,
} from "@/service/UserService"; // Asegúrate de tener la ruta correcta para importar la función

export default function ProfileScreen() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [editField, setEditField] = useState(""); // Estado para controlar qué campo se edita ("name" o "ci")
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // Estado para el correo
  const [billName, setBillName] = useState(""); // Estado para el billName
  const [CI, setCI] = useState(""); // Estado para CI/NIT
  const [inputValue, setInputValue] = useState(""); // Valor del campo de entrada
  const [originalBillName, setOriginalBillName] = useState(""); // Estado para guardar el billName original
  const [originalCI, setOriginalCI] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getCustomerProfile(); // Llama al endpoint
        setName(data.payload.user.name); // Establece el nombre del usuario
        setEmail(data.payload.user.email); // Establece el correo
        setBillName(data.payload.billName); // Establece el billName
        setCI(data.payload.nit); // Establece el CI/NIT
        setOriginalBillName(data.payload.billName); // Guarda el valor original de billName
        setOriginalCI(data.payload.nit);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchProfile(); // Ejecutar la función para obtener el perfil
  }, []);

  const handleEditPress = (field: "billName" | "ci") => {
    setEditField(field);
    if (field === "billName") {
      setInputValue(billName);
    } else if (field === "ci") {
      setInputValue(CI);
    }
    setModalVisible(true);
  };

  const handleSavePress = async () => {
    if (editField === "billName") {
      setBillName(inputValue); // Actualizar billName en el estado local
    } else if (editField === "ci") {
      setCI(inputValue); // Actualizar CI en el estado local
    }

    try {
      console.log("bill", billName);
      console.log("nit", CI);

      // Verifica qué campo se está editando y envía los valores correctos
      if (editField === "billName") {
        await updateCustomerProfile(inputValue, originalCI); // Envía el nuevo billName y el CI original
        setBillName(inputValue); // Actualiza el estado local de billName
        setOriginalBillName(inputValue); // Actualiza el valor original de billName
      } else if (editField === "ci") {
        await updateCustomerProfile(originalBillName, inputValue); // Envía el billName original y el nuevo CI
        setCI(inputValue); // Actualiza el estado local de CI
        setOriginalCI(inputValue); // Actualiza el valor original de CI
      }

      Alert.alert("Éxito", "Datos de facturación actualizados correctamente.");
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al actualizar los datos.");
      console.error("Error al actualizar los datos:", error);
    }
  };

  const handleCancelPress = () => {
    setInputValue("");
    setModalVisible(false);
  };

  const handleBillNameChange = (text: string) => {
    const filteredText = text.replace(/[^a-zA-Z\s]/g, ""); // Filtrar solo letras y espacios
    setInputValue(filteredText);
  };

  const handleCIChange = (text: string) => {
    const filteredText = text.replace(/[^0-9]/g, ""); // Filtrar solo números
    setInputValue(filteredText);
  };

  return (
    <View style={styles.container}>
      {/* Sección de la foto y nombre del usuario */}
      <View style={styles.profileHeader}>
        <Ionicons name="person-circle" size={150} color="#86AB9A" />
        <Text style={styles.profileName}>{name}</Text>
      </View>

      {/* Información de Facturación */}
      <View style={styles.infoContainer}>
        {/* Correo de facturación */}
        <View style={styles.fieldContainer}>
          <View style={styles.iconAndLabelContainer}>
            <Ionicons name="mail-outline" size={26} color="#86AB9A" />
            <Text style={styles.fieldLabel}>Correo Electrónico</Text>
          </View>
          <View style={styles.userInfoContainer}>
            <Text style={styles.userInfo}>{email}</Text>
            {/* <TouchableOpacity>
              <Text style={styles.editText}>Editar</Text>
            </TouchableOpacity> */}
          </View>
        </View>

        {/* Nombre de facturación */}
        <View style={styles.fieldContainer}>
          <View style={styles.iconAndLabelContainer}>
            <Ionicons
              name="information-circle-outline"
              size={26}
              color="#86AB9A"
            />
            <Text style={styles.fieldLabel}>Nombre de Facturación</Text>
          </View>
          <View style={styles.userInfoContainer}>
            <Text style={styles.userInfo}>{billName}</Text>
            <TouchableOpacity onPress={() => handleEditPress("billName")}>
              <Text style={styles.editText}>Editar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CI/NIT */}
        <View style={styles.lastFieldContainer}>
          <View style={styles.iconAndLabelContainer}>
            <Ionicons name="pricetag-outline" size={26} color="#86AB9A" />
            <Text style={styles.fieldLabel}>CI/NIT</Text>
          </View>
          <View style={styles.userInfoContainer}>
            <Text style={styles.userInfo}>{CI}</Text>
            <TouchableOpacity onPress={() => handleEditPress("ci")}>
              <Text style={styles.editText}>Editar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modal para editar el nombre o CI/NIT */}
        <Modal visible={isModalVisible} transparent={true} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {editField === "billName"
                  ? "Editar Nombre de Facturación"
                  : "Editar CI/NIT"}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={`Ingrese nuevo ${
                  editField === "billName" ? "nombre" : "CI/NIT"
                }`}
                value={inputValue}
                onChangeText={
                  editField === "billName"
                    ? handleBillNameChange
                    : handleCIChange
                }
                keyboardType={editField === "billName" ? "default" : "numeric"} // Teclado numérico para CI/NIT
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleCancelPress}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSavePress}
                >
                  <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
    /* TODO: Agregar un botón de cerrar sesión */
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    padding: 20,
  },
  profileHeader: {
    alignItems: "center",
    backgroundColor: "#D1E4DE",
    paddingVertical: 30,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 5,
  },
  profileName: {
    marginTop: 10,
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
  },
  infoContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  fieldContainer: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  lastFieldContainer: {
    paddingVertical: 20,
  },
  userInfoContainer: {
    flexDirection: "row", // Colocar la info del cliente y el botón en una fila
    justifyContent: "space-between", // Distribuir espacio entre el texto y el botón
    alignItems: "center", // Centrar verticalmente los elementos
    marginTop: 5, // Separar un poco del título
  },
  iconAndLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  fieldLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#333",
  },
  userInfo: {
    fontSize: 16,
    color: "#333",
    paddingVertical: 5,
    marginLeft: 36,
  },
  editText: {
    color: "#60A6A5",
    textDecorationLine: "underline",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semitransparente
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#F0F0F2",
    padding: 25,
    borderRadius: 25,
    width: "85%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 15,
    fontSize: 16,
    borderColor: "#ddd",
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#86AB9A",
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});
