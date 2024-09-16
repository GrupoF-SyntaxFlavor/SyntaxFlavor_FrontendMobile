import React, { useState } from 'react';
import { DataTable, Divider, TextInput, HelperText} from 'react-native-paper';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';



export default function InvoiceScreen() {
  const [items] = React.useState([
    {
      id: 1,
      name: 'Cupcake',
      price: 356,
      quantity: 16,
    },
    {
      id: 2,
      name: 'Eclair',
      price: 262,
      quantity: 16,
    },
    {
      id: 3,
      name: 'Frozen yogurt',
      price: 159,
      quantity: 6,
    },
    {
      id: 4,
      name: 'Gingerbread',
      price: 305,
      quantity: 3.7,
    },
  ]);
  // Lista de productos seleccionados
  const [products, setProducts] = useState(items); 
  //Campo para el nombre de la factura
  const [billName, setBillName] = React.useState('');
  //Campo para el NIT o CI de la factura
  const [nit, setNit] = React.useState('');

  //Funciones para el nombre de la factura
  const onChangeBillName = (billName: React.SetStateAction<string>) => setBillName(billName);
  const hasErrorsBillName = () => {
    return !/^[a-zA-Z]+$/.test(billName);  // Retorna true si hay caracteres que no son letras
  };

  //Funciones para el NIT o CI de la factura
  const onChangeNit = (nit: React.SetStateAction<string>) => setNit(nit);
  const hasErrorsNit = () => {
    return !/^\d+$/.test(nit);  // Retorna true si hay caracteres no numéricos
  };
  
  // Calcular el total por producto (cantidad * precio)
  const calculateTotal = (): number => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
  <ScrollView  style={styles.container}>
      {/* Título de la página */}
      <Text style={styles.title}>Datos de facturación</Text>
      
      {/* Tabla de productos seleccionados */}
      <Text style={styles.subtitle}>Resumen</Text>

      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Producto</DataTable.Title>
          <DataTable.Title numeric>Cantidad</DataTable.Title>
          <DataTable.Title numeric>Total</DataTable.Title>
        </DataTable.Header>
        {products.map((item) => (
          <DataTable.Row key={item.id}>
            <DataTable.Cell>{item.name}</DataTable.Cell>
            <DataTable.Cell numeric>{item.quantity}</DataTable.Cell>
            <DataTable.Cell numeric>{item.price * item.quantity}</DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
        
      {/* Total de la compra */}
      <Text style={styles.priceTotal}>Total: {calculateTotal()}</Text>
      
      {/* Espacio entre la tabla y el divisor */}
      <View style={{ marginBottom: 10 }}></View>
      <Divider /> 
      <View style={{ marginBottom: 10 }}></View>

      <Text style={styles.subtitle}>Datos de facturación</Text>
      
      {/* Nombre en la factura o razón social */}
      <View>
        <TextInput label="Nombre/ Razón Social" value={billName} onChangeText={onChangeBillName} />
        <HelperText type="error" visible={hasErrorsBillName()}>
          El nombre debe contener sólo letras
        </HelperText>
      </View>
      {/* NIT o CI para la factura */}
      <View>
        <TextInput label="NIT/ CI" value={nit} onChangeText={onChangeNit} />
        <HelperText type="error" visible={hasErrorsNit()}>
          El NIT/ CI debe contener sólo números
        </HelperText>
      </View>
      {/* Espacio entre los datos y el divisor */}
      <View style={{ marginBottom: 10 }}></View>
      <Divider /> 
      <View style={{ marginBottom: 10 }}></View>

      <Text style={styles.subtitle}>Método de pago</Text>
      <Image
        source={require('../assets/images/QR_code.svg')}  // Cambia la ruta según tu carpeta
        style={styles.image}
      />
      {/* Botón para procesar */}
      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Pagado</Text>
      </TouchableOpacity>
    </ScrollView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  priceTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 5,
    marginRight: 15,
  },
  submitButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: '80%',             // La imagen ocupará el 80% del ancho del contenedor
    height: undefined,        // Altura automática para mantener la proporción
    aspectRatio: 1,           // Mantiene la proporción de la imagen (1:1 para cuadrado)
    resizeMode: 'contain',    // Contiene la imagen dentro del área sin distorsión
    alignSelf: 'center',      // Asegura que esté centrada en su contenedor
  },
});
