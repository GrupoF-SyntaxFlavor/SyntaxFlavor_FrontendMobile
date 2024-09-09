import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Link, useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface TopNavBarProps {
  icons?: { name: keyof typeof Ionicons.glyphMap; link: string }[];
}

export default function TopNavBar({ icons = [] }: TopNavBarProps) {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const pathname = usePathname();

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
  },
});