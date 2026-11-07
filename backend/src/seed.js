const bcrypt = require('bcryptjs');
const { Usuario, Equipo } = require('./database');

async function cargarDatosIniciales() {
  const usuariosDemo = [
    { nombre: 'Usuario Uno', correo: 'usuario@lab.local', clave: 'Usuario123!', rol: 'usuario' },
    { nombre: 'Usuario Dos', correo: 'otro@lab.local', clave: 'Otro123!', rol: 'usuario' },
    { nombre: 'Técnico Uno', correo: 'tecnico@lab.local', clave: 'Tecnico123!', rol: 'tecnico' },
  ];
  for (const u of usuariosDemo) {
    const contrasenaHash = await bcrypt.hash(u.clave, 10);
    await Usuario.findOrCreate({
      where: { correo: u.correo },
      defaults: { nombre: u.nombre, correo: u.correo, contrasenaHash, rol: u.rol },
    });
  }
  const equipos = [
    { codigo: 'LAB-001', nombre: 'Computadora 01' },
    { codigo: 'LAB-002', nombre: 'Computadora 02' },
    { codigo: 'LAB-003', nombre: 'Proyector' },
    { codigo: 'LAB-004', nombre: 'Impresora' },
  ];
  for (const equipo of equipos) {
    await Equipo.findOrCreate({ where: { codigo: equipo.codigo }, defaults: equipo });
  }
}

module.exports = { cargarDatosIniciales };
