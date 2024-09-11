/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

// const palette = {
//   green: '#86AB9A',
//   lightGreen: '#D1E4DE',
//   greenGray: '#A1B2AA',
//   lightGray: '#F0F0F2',
//   darkGray: '#898988',
// };

// export const Colors = {
//   light: {
//     text: palette.darkGray,       // Texto en modo claro
//     background: palette.lightGray,  // Fondo en modo claro
//     tint: palette.green,          // Color primario
//     icon: palette.darkGray,       // Color de iconos
//     tabIconDefault: palette.darkGray,
//     tabIconSelected: palette.green,
//   },
//   dark: {
//     text: palette.lightGray,      // Texto en modo oscuro
//     background: palette.darkGray, // Fondo en modo oscuro
//     tint: palette.lightGreen,     // Color primario en modo oscuro
//     icon: palette.lightGray,      // Color de iconos en modo oscuro
//     tabIconDefault: palette.lightGray,
//     tabIconSelected: palette.lightGreen,
//   },
// };
