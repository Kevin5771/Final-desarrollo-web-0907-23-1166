const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  nombre: { type: DataTypes.STRING, allowNull: false },
  correo: { type: DataTypes.STRING, allowNull: false, unique: true },
  contrasenaHash: { type: DataTypes.STRING, allowNull: false },
  rol: { type: DataTypes.ENUM('usuario', 'tecnico'), allowNull: false, defaultValue: 'usuario' },
});
const Equipo = sequelize.define('Equipo', {
  codigo: { type: DataTypes.STRING, allowNull: false, unique: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
});
const Incidencia = sequelize.define('Incidencia', {
  descripcion: { type: DataTypes.TEXT, allowNull: false },
  estado: { type: DataTypes.ENUM('abierta', 'cerrada'), allowNull: false, defaultValue: 'abierta' },
  fechaCierre: { type: DataTypes.DATE, allowNull: true },
});

Usuario.hasMany(Incidencia, { foreignKey: { name: 'usuarioId', allowNull: false }, as: 'incidencias' });
Incidencia.belongsTo(Usuario, { foreignKey: { name: 'usuarioId', allowNull: false }, as: 'creador' });
Equipo.hasMany(Incidencia, { foreignKey: { name: 'equipoId', allowNull: false }, as: 'incidencias' });
Incidencia.belongsTo(Equipo, { foreignKey: { name: 'equipoId', allowNull: false }, as: 'equipo' });

module.exports = { sequelize, Usuario, Equipo, Incidencia };
