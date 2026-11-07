# Consultas de apoyo durante el proyecto

Esta lista resume las consultas de apoyo; no es una copia literal de los mensajes.

1. Cómo organizar la estructura inicial del proyecto, separando el backend con Express del frontend con React.
2. Qué dependencias necesita cada parte y qué comandos se usan para instalarlas y ejecutar el proyecto.
3. Revisar en el código que solo el creador de una incidencia o un técnico puedan cerrarla, y que el servidor rechace a otro usuario con un error 403.
4. Mejorar el backend usando una estructura agregando un patrón de diseño sencillo como lo es Repository.

También hubo apoyo en la organización de la interfaz y en las pruebas para los distintos usuarios. Después de separar el backend se ejecutó una prueba automática por HTTP con las tres cuentas y una base de datos en memoria. Todavía falta comprobar manualmente las pantallas en el navegador.

## Caso de uso con fallo: continuar trabajando con una sesión vencida

Caso identificado durante la revisión del código: el usuario inicia sesión, deja el panel abierto y la sesión vence o se pierde al reiniciar el servidor. Al intentar registrar o cerrar una incidencia, la API responde 401. Antes de la corrección, el panel seguía visible y solo aparecía el mensaje de error; no se ofrecía nuevamente el formulario de acceso.

Consulta de seguimiento propuesta a partir de ese hallazgo (no es una transcripción de un prompt anterior): «Revisa qué sucede cuando vence la sesión mientras el panel está abierto. Si la API devuelve 401, vuelve al login sin confundirlo con un error de contraseña al iniciar sesión».

La corrección conecta las respuestas 401 del cliente HTTP con el estado de autenticación de `App`. Para comprobarla manualmente: iniciar sesión, reiniciar el backend y pulsar Actualizar en el panel. El resultado esperado es volver al login. Esta comprobación en navegador está pendiente; el fallo se detectó por inspección del código.
