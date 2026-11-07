const { Incidencia, Equipo, Usuario } = require('../models');
const relaciones = [
  { model: Equipo, as: 'equipo', attributes: ['id', 'codigo', 'nombre'] },
  { model: Usuario, as: 'creador', attributes: ['id', 'nombre'] },
];
module.exports = {
  listar() { return Incidencia.findAll({ include: relaciones, order: [['createdAt', 'DESC']] }); },
  buscarPorId(id) { return Incidencia.findByPk(id, { include: relaciones }); },
  crear(datos) { return Incidencia.create(datos); },
  async cerrar(id) {
    // La condición evita que dos solicitudes cierren el mismo reporte a la vez.
    const [cantidad] = await Incidencia.update(
      { estado: 'cerrada', fechaCierre: new Date() },
      { where: { id, estado: 'abierta' } },
    );
    return cantidad > 0;
  },
};
