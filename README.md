
# Films Api 🚀

¡Bienvenido a Films API!

Este proyecto es la entrega del desafío de conexa.ai, donde desarrollo una API RESTful para la gestión de películas integrada con la API de Star Wars.

## Descripcion general:

- **NestJS y PostgreSQL:** Se utilizó el framework NestJS para construir la API y PostgreSQL como base de datos.
  
- **Variables de entorno:** La configuración de la API se gestiona mediante archivos de variables de entorno. Existen dos archivos: `.env.prod` para entorno productivo y `.env.dev` para entorno de desarrollo. La selección del archivo a utilizar depende de la variable de entorno `NODE_ENV`, por defecto funciona con el archivo destinado para desarrollo.

- **Docker:** Existe soporte para Docker tanto en entorno de producción como de desarrollo. Estaran presentes un `Dockerfile` para producción y un `Dockerfile.dev` para desarrollo.

- **Docker Compose:** Para facilitar el desarrollo, incluí un archivo `docker-compose` que utiliza el `Dockerfile.dev` y levanta una instancia de la base de datos PostgreSQL.

- **Documentación Swagger:** Integré documentación Swagger para facilitar el uso y comprensión de la API. Podés acceder a la documentación en `/docs`.

## Uso:

### Opción 1: Docker Compose

Se recomienda el uso de `docker-compose` para simplificar la configuración:

```bash
docker-compose up
```
Este comando iniciará todos los servicios definidos en el archivo docker-compose.yml.

### Opción 2: Cargar Credenciales de PostgreSQL
Si prefieres cargar las credenciales de una base de datos PostgreSQL en un archivo .env.prod, podés ejecutar:

```bash
pnpm run start:dev
```

Esto iniciará la aplicación utilizando las credenciales definidas en el archivo .env.prod.

### Opción 3: Iniciar Solo la Base de Datos
También podés instanciar solo la base de datos utilizando docker-compose:

```bash
docker-compose up db
```

Esto iniciará únicamente el servicio de la base de datos PostgreSQL definido en tu archivo docker-compose.yml. Para levantar le proyecto en otra terminal siga la opción 2
## API Docs
Es posible acceder al panel de Swagger para probar fácilmente todos los endpoints visitando http://localhost:3000/docs.

### Acceso
Dado que la mayoría de los endpoints están protegidos inicialmente, primero es necesario ejecutar el endpoint `/api/seed`. Aunque en una aplicación real no tendría sentido por razones de seguridad, este endpoint genera un usuario administrador y devuelve sus credenciales. Luego deberá utilizar estas credenciales en la sección de inicio de sesión (login) para despues cargar el token en el input que aparecerá al hacer clic en el botón `Authorize 🔒` en la parte superior del sitio.
## Testing 🧪

La api cuenta con pruebas unitarias independientes en cada modulo. Para ejecutarla puede usar el comando
```bash
pnpm run test
```
Tambien puede ver el coverage con
```
pnpm run test:cov
``` 

## Author

Gracias por ver!

- [@ivanldz](https://www.github.com/ivanldz)

