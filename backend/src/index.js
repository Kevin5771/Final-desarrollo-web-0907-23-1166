require('dotenv').config();
const { sequelize } = require('./database');
const { cargarDatosIniciales } = require('./seed');
const { app } = require('./app');

const puerto = Number(process.env.PORT || 3001);
async function iniciar() {
  await sequelize.authenticate();
  await sequelize.sync();
  await cargarDatosIniciales();
  app.listen(puerto, () => console.log(`Backend listo en http://localhost:${puerto}`));
}
iniciar().catch((error) => {
  console.error('No se pudo iniciar el servidor:', error);
  process.exit(1);
});
