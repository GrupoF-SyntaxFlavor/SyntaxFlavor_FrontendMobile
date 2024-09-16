import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Link, useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useCart } from '@/contexts/CartContext';

interface TopNavBarProps {
  icons?: { name: keyof typeof Ionicons.glyphMap; link: string }[];
}

export default function TopNavBar({ icons = [] }: TopNavBarProps) {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const pathname = usePathname();
  const { cartItems } = useCart();

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      {pathname !== '/' ? (
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={30} color={Colors[colorScheme ?? 'light'].tint} />
        </TouchableOpacity>
      ) : (
        <View style={styles.backButtonPlaceholder} />
      )}
      <View style={styles.iconsContainer}>
        {icons.map((icon, index) => (
          <Link key={index} href={icon.link as any} asChild>
            <TouchableOpacity style={styles.icon}>
              <Ionicons name={icon.name} size={30} color={Colors[colorScheme ?? 'light'].tint} />
              {icon.name === 'cart-outline' && cartItems.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartItems.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          </Link>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    marginRight: 15,
  },
  backButtonPlaceholder: {
    width: 30, // Ancho similar al botón de retroceso
    height: 30,
    marginRight: 15,
  },
  iconsContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 15,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});