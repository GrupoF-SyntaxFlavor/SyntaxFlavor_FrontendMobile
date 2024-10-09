# SyntaxFlavor_FrontendMobile

## Cómo correr el proyecto

TODO: Agregar instrucciones para correr el proyecto

### Configuración del backend

Hay un archivo llamado `.backend-dir.ts` en la carpeta `constants` que contiene la dirección del backend. Por defecto, la dirección es `http://localhost:8080`. Si tienes un backend en otra dirección, cambia la dirección en este archivo. Por ejemplo: //TODO: Actualizar para usar BACKEND_API, SPRING_PORT, MINIO_PORT

```typescript	
// Localhost
export const BACKEND_URL = "http://localhost:8080";

// Alejandro's IP
// export const BACKEND_URL = "http://192.168.0.12:8080";
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
