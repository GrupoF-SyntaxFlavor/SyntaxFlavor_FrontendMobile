import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

const Loader = () => {
  const rotateValue = useRef(new Animated.Value(0)).current;

  // Configura la animación de rotación infinita
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 300, // Duración de la animación
        useNativeDriver: true,
      })
    ).start();
  }, [rotateValue]);

  // Interpolación de la rotación
  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.loader,
          { transform: [{ rotate }] }, // Aplica la animación de rotación
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 8,
    borderColor: '#d1914b',
    borderTopColor: '#d64123', // Color del borde superior para el efecto de spinner
    borderStyle: 'solid',
    backgroundColor: '#f6d353', // Fondo del loader
  },
});

export default Loader;
