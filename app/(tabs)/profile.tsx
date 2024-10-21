import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getCustomerProfile,
  updateCustomerProfile,
} from "@/service/UserService"; // Asegúrate de tener la ruta correcta para importar la función
import { useUser } from "@/contexts/UserContext";


export default function ProfileScreen() {
  const { name, email, billName, jwt, nit, setUserProfile, updateUserProfile, logout } = useUser();
  const [inputValue, setInputValue] = useState("");
  const [editField, setEditField] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setUserProfile();
  }, []);

  const handleEditPress = (field: "billName" | "ci") => {
    setEditField(field);
    if (field === "billName") {
      setInputValue(billName);
    } else if (field === "ci") {
      setInputValue(nit);
    }
    setModalVisible(true);
  };

  const handleSavePress = async () => {
    if (editField === "billName") {
      console.log(`Updating billName to: ${inputValue}`);
      updateUserProfile(inputValue, "billName");
    } else if (editField === "ci") {
      console.log(`Updating CI/NIT to: ${inputValue}`);
      updateUserProfile(inputValue, "ci");
    }
    setInputValue("");
    setModalVisible(false);
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }} // Ensure the KeyboardAvoidingView takes full height
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
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
              <Text style={styles.userInfo}>{nit}</Text>
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
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
  },
  profileHeader: {
    alignItems: "center",
    backgroundColor: "#D1E4DE",
    paddingVertical: height * 0.04,
    borderRadius: 20,
    marginBottom: height * 0.03,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 5,
  },
  profileName: {
    marginTop: 10,
    fontSize: width * 0.08,
    fontWeight: "bold",
    color: "#333",
  },
  infoContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.04,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  fieldContainer: {
    paddingVertical: height * 0.025, 
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  lastFieldContainer: {
    paddingVertical: height * 0.025,
  },
  userInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: height * 0.01,
  },
  iconAndLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  fieldLabel: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#333",
  },
  userInfo: {
    fontSize: width * 0.04, 
    color: "#333",
    paddingVertical: 5,
    marginLeft: 36,
  },
  editText: {
    color: "#60A6A5",
    textDecorationLine: "underline",
    fontSize: width * 0.04,
    fontWeight: "bold",
    marginRight: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
    fontSize: width * 0.045,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 15,
    fontSize: width * 0.04,
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
    paddingHorizontal: width * 0.05,
    backgroundColor: "#86AB9A",
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: width * 0.04, 
  },
  logoutButton: {
    backgroundColor: "#FF6347", // Color rojo para el botón de cerrar sesión
    width: "80%",
    paddingVertical: "2%",
    borderRadius: 10,
    marginTop: "5%",
    marginBottom: "5%",
    alignItems: "center",
    alignSelf: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
});