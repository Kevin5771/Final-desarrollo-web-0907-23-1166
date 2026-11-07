const equipos = require('../services/equipo.service');
async function listar(req, res, next) {
  try { res.json(await equipos.listar()); }
  catch (error) { next(error); }
}
module.exports = { listar };
