# SyntaxFlavor_FrontendMobile

## Cómo correr el proyecto

TODO: Agregar instrucciones para correr el proyecto

### Configuración del backend

Hay un archivo llamado `.backend-dir.ts` en la carpeta `constants` que contiene la dirección del backend. Por defecto, la dirección es `http://localhost:8080`. Si tienes un backend en otra dirección, cambia la dirección en este archivo. Por ejemplo:

```typescript	
// Localhost
export const BACKEND_URL = "http://localhost:8080";

// Alejandro's IP
// export const BACKEND_URL = "http://192.168.0.12:8080";
```

Para que cada miembro del equipo pueda tener su propia configuración, este archivo está en el `.gitignore`.