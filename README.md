# SyntaxFlavor_FrontendMobile

## Cómo correr el proyecto

### Cómo correr el proyecto

1. **Instalar dependencias**: Asegúrate de tener las herramientas necesarias instaladas en tu entorno local.

   - **Node.js**: Instala la última versión estable desde [nodejs.org](https://nodejs.org).
   - **Expo CLI**: Instala Expo CLI globalmente si aún no lo tienes.
     ```bash
     npm install -g expo-cli
     ```
   - **Android Studio o Xcode (opcional)**: Si deseas ejecutar el proyecto en un emulador.

2. **Clonar el repositorio**: Si no tienes el código en tu máquina, clónalo desde el repositorio.

   ```bash
   git clone <URL-del-repositorio>
   cd <nombre-del-proyecto>
   ```

3. **Instalar dependencias del proyecto**: Ejecuta el siguiente comando dentro del directorio raíz del proyecto para instalar todas las dependencias necesarias.

   ```bash
   npm install
   ```

4. **Configurar el backend**: Modifica la configuración del backend en el archivo `.backend-dir.ts` dentro de la carpeta `constants`. 

   - Por defecto, el backend se conecta a `http://localhost:8080`. Si tu backend está en otra dirección o puerto, actualiza las siguientes constantes:

     ```typescript
     export const BACKEND_DOMAIN = "localhost"; // Cambia a tu dirección IP o dominio
     export const SPRING_PORT = ":8080"; // Cambia si el puerto es diferente
     export const MINIO_PORT = ":9090"; // Cambia si utilizas otro puerto para MinIO
     ```

   - Guarda los cambios. Este archivo está en `.gitignore`, por lo que no afectará a otros desarrolladores.

5. **Iniciar el servidor backend**: Asegúrate de que el backend esté ejecutándose y accesible en la dirección configurada.

6. **Ejecutar el proyecto**: Inicia el servidor de desarrollo de Expo.

   ```bash
   npx expo start
   ```

   Esto abrirá una ventana en tu navegador con un código QR que puedes escanear usando la aplicación **Expo Go** en tu dispositivo móvil.

7. **Probar la aplicación en un dispositivo/emulador**:

   - **Dispositivo físico**: Descarga la app **Expo Go** desde Google Play Store o App Store. Escanea el código QR generado por Expo CLI.
   - **Emulador Android/iOS**:
     - Asegúrate de que Android Studio o Xcode estén configurados correctamente.
     - Haz clic en **Run on Android device/emulator** o **Run on iOS simulator** desde la ventana del servidor Expo.

8. **Configuraciones opcionales**:
   - **Variables de entorno**: Si utilizas un archivo `.env`, asegúrate de que esté configurado correctamente con las variables necesarias para la aplicación.

   - **Resolución de problemas comunes**:
     - Si encuentras un error relacionado con la caché, intenta limpiar el caché de Expo:
       ```bash
       expo start -c
       ```

¡Ahora deberías poder correr la aplicación sin problemas! 🚀

### Configuración del backend

Hay un archivo llamado `.backend-dir.ts` en la carpeta `constants` que contiene la dirección del backend. Por defecto, la dirección es `http://localhost:8080`. Si tienes un backend en otra dirección, cambia la dirección en este archivo. Por ejemplo: //TODO: Actualizar para usar BACKEND_API, SPRING_PORT, MINIO_PORT

```typescript	
// export const BACKEND_DOMAIN = "192.168.0.14"
export const BACKEND_DOMAIN = "localhost"
export const SPRING_PORT = ":8080"
export const MINIO_PORT = ":9090"
```

Para que cada miembro del equipo pueda tener su propia configuración, este archivo está en el `.gitignore`.

## De la estructura

### `app`

Contiene los elementos de la aplicación, como los componentes, las pantallas, los estilos y las rutas.

### `assets`

Contiene los recursos de la aplicación, como las imágenes y los estilos globales. En general son recursos que no son específicos de un componente o una pantalla. Siempre son estáticos.

### `components`

Contiene los componentes de la aplicación. Los componentes son elementos que se pueden reutilizar en diferentes partes de la aplicación. Por ejemplo, un botón, un input, un modal, etc.

### `constants`

Contiene los archivos de configuración de la aplicación, como las direcciones del backend y las constantes de la aplicación.

### `contexts`

Contiene los contextos de la aplicación. Los contextos son elementos que permiten compartir información entre diferentes componentes de la aplicación. Son una representación del estado global de la aplicación.

### `hooks`

Contiene los hooks de la aplicación. Los hooks son funciones que permiten reutilizar lógica en diferentes partes de la aplicación. Son una forma de compartir lógica entre componentes.

### `lib`

Contiene las librerías de la aplicación. Las librerías son elementos que permiten reutilizar lógica en diferentes partes de la aplicación. Son una forma de compartir lógica entre componentes. En este caso se están utilizando para castear objetos DTO de backend a modelos de frontend.

### `models`

Contiene los modelos de la aplicación. Los modelos son interfaces de objetos que se utilizan en diferentes partes de la aplicación. Son una forma de compartir la estructura de los objetos entre componentes.

### `service`

Contiene los servicios de la aplicación. Los servicios son elementos que permiten realizar peticiones al backend. Son una forma de compartir la lógica de las peticiones entre componentes.
