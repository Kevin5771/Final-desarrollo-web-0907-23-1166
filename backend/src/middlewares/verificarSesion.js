const auth = require('../services/auth.service');
const ErrorAplicacion = require('../errors/ErrorAplicacion');
module.exports = async function verificarSesion(req, res, next) {
  try {
    if (!req.session.usuarioId) throw new ErrorAplicacion(401, 'Inicia sesión primero.');
    const usuario = await auth.consultarSesion(req.session.usuarioId);
    if (!usuario) throw new ErrorAplicacion(401, 'La sesión ya no es válida.');
    req.usuario = usuario;
    next();
  } catch (error) { next(error); }
};
