const incidencias = require('../repositories/incidencia.repository');
const equipos = require('../repositories/equipo.repository');
const ErrorAplicacion = require('../errors/ErrorAplicacion');
function listar() { return incidencias.listar(); }
async function registrar({ equipoId, descripcion } = {}, usuario) {
  const id = Number(equipoId);
  if (!['number', 'string'].includes(typeof equipoId) || !Number.isSafeInteger(id) || id <= 0) {
    throw new ErrorAplicacion(400, 'Selecciona un equipo válido.');
  }
  if (typeof descripcion !== 'string' || descripcion.trim().length < 5 || descripcion.trim().length > 2000) {
    throw new ErrorAplicacion(400, 'La descripción debe tener entre 5 y 2000 caracteres.');
  }
  const equipo = await equipos.buscarPorId(id);
  if (!equipo) throw new ErrorAplicacion(404, 'Equipo no encontrado.');
  const creada = await incidencias.crear({ equipoId: equipo.id, descripcion: descripcion.trim(), usuarioId: usuario.id });
  return incidencias.buscarPorId(creada.id);
}
async function cerrar(id, usuario) {
  if (!/^\d+$/.test(String(id)) || !Number.isSafeInteger(Number(id)) || Number(id) <= 0) {
    throw new ErrorAplicacion(400, 'El identificador de incidencia no es válido.');
  }
  const incidencia = await incidencias.buscarPorId(Number(id));
  if (!incidencia) throw new ErrorAplicacion(404, 'Incidencia no encontrada.');
  if (incidencia.usuarioId !== usuario.id && usuario.rol !== 'tecnico') {
    throw new ErrorAplicacion(403, 'Solo el creador o un técnico puede cerrar esta incidencia.');
  }
  if (incidencia.estado === 'cerrada' || !(await incidencias.cerrar(incidencia.id))) {
    throw new ErrorAplicacion(409, 'La incidencia ya está cerrada.');
  }
  return incidencias.buscarPorId(incidencia.id);
}
module.exports = { listar, registrar, cerrar };
