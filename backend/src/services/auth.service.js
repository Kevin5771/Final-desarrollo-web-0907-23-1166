const bcrypt = require('bcryptjs');
const usuarios = require('../repositories/usuario.repository');
const ErrorAplicacion = require('../errors/ErrorAplicacion');
function datosPublicos(usuario) {
  return { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol };
}
async function autenticar({ correo, contrasena } = {}) {
  if (typeof correo !== 'string' || typeof contrasena !== 'string') {
    throw new ErrorAplicacion(400, 'Correo y contraseña son obligatorios.');
  }
  const usuario = await usuarios.buscarPorCorreo(correo.trim().toLowerCase());
  if (!usuario || !(await bcrypt.compare(contrasena, usuario.contrasenaHash))) {
    throw new ErrorAplicacion(401, 'Credenciales incorrectas.');
  }
  return datosPublicos(usuario);
}
async function consultarSesion(id) {
  const usuario = id ? await usuarios.buscarPorId(id) : null;
  return usuario ? datosPublicos(usuario) : null;
}
module.exports = { autenticar, consultarSesion };
