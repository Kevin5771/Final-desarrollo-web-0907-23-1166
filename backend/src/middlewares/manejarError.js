const ErrorAplicacion = require('../errors/ErrorAplicacion');
module.exports = function manejarError(error, req, res, next) {
  if (error instanceof ErrorAplicacion) return res.status(error.status).json({ error: error.message });
  if (error.type === 'entity.parse.failed') return res.status(400).json({ error: 'El JSON enviado no es válido.' });
  if (error.type === 'entity.too.large') return res.status(413).json({ error: 'La solicitud es demasiado grande.' });
  console.error('Error en API:', error);
  res.status(500).json({ error: 'Ocurrió un error interno.' });
};
