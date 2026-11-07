const { Usuario } = require('../models');
module.exports = {
  buscarPorId(id) { return Usuario.findByPk(id); },
  buscarPorCorreo(correo) { return Usuario.findOne({ where: { correo } }); },
};
