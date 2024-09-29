import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { View } from "react-native";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import TopNavBar from "@/components/navigation/TopNavBar";
import { Ionicons } from "@expo/vector-icons";
import { CartProvider } from "@/contexts/CartContext";
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const screenIcons: {
    [key: string]: { name: keyof typeof Ionicons.glyphMap; link: string }[];
  } = {
    "(tabs)": [{ name: "cart-outline", link: "/cart" }],
    cart: [],
    "invoice-form": [],
    "menu-item": [{ name: "cart-outline", link: "/cart" }],
  };

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }}>
        {/* Envoltura del CartProvider y acceso a las demás pantallas */}
        <CartProvider>
          <Stack
            screenOptions={({ route }) => ({
              header: () => <TopNavBar icons={screenIcons[route.name] || []} />,
              animation: "none",
            })}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="cart" />
            <Stack.Screen name="invoice-form" />
            <Stack.Screen name="menu-item" />
            <Stack.Screen name="payment-method" />
          </Stack>
        </CartProvider>
      </View>
    </ThemeProvider>
  );
}
