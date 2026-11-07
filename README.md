# Control de incidencias del laboratorio

## Usuarios de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Usuario dueño | `usuario@lab.local` | `Usuario123!` |
| Otro usuario | `otro@lab.local` | `Otro123!` |
| Técnico | `tecnico@lab.local` | `Tecnico123!` |


## Prueba de la regla de cierre

1. Iniciar sesión con `usuario@lab.local` y registrar incidencia.
2. Cerrar sesión. Entrar con `otro@lab.local`: el botón no aparecerá para cerrar incidencia ajena; incluso si se llama manualmente el endpoint, responde `403`.
3. Entrar con `tecnico@lab.local`: puede cerrar incidencias de cualquier usuario.

## Diseño

El backend está organizado por capas. El recorrido de una petición es:

`routes → controllers → services → repositories → models`

- `routes`: define las direcciones y aplica la comprobación de sesión.
- `controllers`: recibe la petición y devuelve la respuesta HTTP.
- `services`: valida los datos y aplica las reglas, como quién puede cerrar una incidencia.
- `repositories`: concentra las consultas de Sequelize mediante el patrón Repository.
- `models`: define las tablas y sus relaciones.
- `config`: configura la conexión a SQLite.
- `middlewares`: comprueba la sesión y maneja errores.

Repository permite que los servicios utilicen funciones como `buscarPorId` o `crear` sin escribir consultas de Sequelize. Se usan módulos sencillos, sin agregar clases base ni dependencias nuevas.

