import React from 'react';
import Menu from '../menu';
import { View, Text, StyleSheet } from 'react-native';

export default function IndexScreen() {
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