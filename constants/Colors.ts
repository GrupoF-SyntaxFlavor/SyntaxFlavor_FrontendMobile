//TODO: Cambiar los colores de la aplicación en modo oscuro
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
    text: "#ECEDEE", // Texto claro para modo oscuro
    background: "#151718", // Fondo oscuro para modo oscuro
    tint: tintColorDark, // Color verde como color principal en modo oscuro
    icon: "#9BA1A6", // Iconos en gris claro en modo oscuro
    tabIconDefault: "#9BA1A6", // Icono de pestaña por defecto
    tabIconSelected: tintColorDark, // Icono seleccionado en verde
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
