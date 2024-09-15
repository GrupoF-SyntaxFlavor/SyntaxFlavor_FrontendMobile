import React from 'react';
import Menu from '../menu';
import { View, Text, StyleSheet } from 'react-native';

export default function IndexScreen() {
  // return (
  //   <View style={styles.container}>
  //     <Text style={styles.text}>Inicio Page</Text>
  //   </View>
  // );
  return <Menu/>; // Llama al componente de menú
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});