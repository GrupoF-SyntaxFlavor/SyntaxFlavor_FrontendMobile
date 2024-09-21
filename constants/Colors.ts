/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#86AB9A";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C", // Texto oscuro para modo claro
    background: "#fff", // Fondo blanco para modo claro
    tint: tintColorLight, // Color verde como color principal
    icon: "#60A6A5", // Color para iconos en modo claro
    tabIconDefault: "#A1B2AA", // Icono de pestaña por defecto
    tabIconSelected: tintColorLight, // Icono seleccionado en verde
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};
