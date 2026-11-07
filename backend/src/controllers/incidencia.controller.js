const incidencias = require('../services/incidencia.service');
async function listar(req, res, next) {
  try { res.json(await incidencias.listar()); }
  catch (error) { next(error); }
}
async function registrar(req, res, next) {
  try { res.status(201).json(await incidencias.registrar(req.body || {}, req.usuario)); }
  catch (error) { next(error); }
}
async function cerrar(req, res, next) {
  try { res.json(await incidencias.cerrar(req.params.id, req.usuario)); }
  catch (error) { next(error); }
}
module.exports = { listar, registrar, cerrar };
