# Decisiones del desarrollo

## a) Qué entendí del problema y qué tablas o modelos planteé

Entendí que se necesita llevar un registro de las fallas de los equipos del laboratorio. El usuario debe iniciar sesión, elegir un equipo y escribir qué problema tiene. Después puede consultar si la incidencia sigue abierta o ya está cerrada.

Organicé la información en tres modelos:

- Usuario: guarda el nombre, correo, contraseña en forma de hash y rol. El rol permite distinguir a un usuario normal de un técnico.
- Equipo: guarda el código y el nombre del equipo que se puede reportar.
- Incidencia: guarda la descripción, el estado, la fecha de cierre y las referencias al equipo y al usuario que la registró.

Un usuario puede registrar varias incidencias y un equipo puede tener varios reportes. Cada incidencia pertenece a un usuario y a un equipo.

Para este proyecto usé SQLite porque permite guardar los datos en un archivo sin configurar ua base de datos como lo es SQL SERVER. Separé el backend del frontend para tener por un lado las rutas y la base de datos, y por otro las pantallas de React para la escabilidad del proyecto.

La regla principal es que una incidencia solo la puede cerrar su creador o un técnico. Por eso el permiso se revisa en el servidor. 

## b) Qué partes delegué a IA y por qué

Me apoyé en IA para preparar la estructura inicial de carpetas y los pasos de instalación de las dependencias del backend y del frontend. También la consulté para revisar los modelos, el manejo de la sesión y la validación de permisos al cerrar una incidencia.

Hubo apoyo en la organización de la interfaz y en ejemplos de pruebas con los usuarios de demostración. Usé estas consultas para entender cómo se conectan las partes y revisar posibles errores del código.

La IA me ayudó a realizar pruebas en mi API, creando tests para verificar que las funciones trabajaran correctamente y detectar posibles errores.

## c) Qué hizo mal la IA y cómo lo corregí

Al revisar el código se encontró que el backend sí comprueba quién intenta cerrar la incidencia y devuelve 403 si no es el creador ni un técnico. La revisión de sintaxis del backend pasó, pero todavía falta ejecutar la aplicación y comprobar el registro, el cierre y la sesión con las tres cuentas de prueba.


