const equipos = require('../repositories/equipo.repository');
function listar() { return equipos.listar(); }
module.exports = { listar };
