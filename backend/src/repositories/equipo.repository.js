const { Equipo } = require('../models');
module.exports = {
  listar() { return Equipo.findAll({ order: [['codigo', 'ASC']] }); },
  buscarPorId(id) { return Equipo.findByPk(id); },
};
