const { test } = require('node:test');
const assert = require('node:assert/strict');

process.env.DB_STORAGE = ':memory:';
const { app } = require('../src/app');
const { sequelize } = require('../src/database');
const { cargarDatosIniciales } = require('../src/seed');

test('sesiones, registro y permisos de cierre por HTTP', async (t) => {
  await sequelize.sync();
  await cargarDatosIniciales();
  const servidor = app.listen(0, '127.0.0.1');
  await new Promise(resolve => servidor.once('listening', resolve));
  t.after(async () => {
    await new Promise((resolve, reject) => servidor.close(error => error ? reject(error) : resolve()));
    await sequelize.close();
  });
  const base = `http://127.0.0.1:${servidor.address().port}/api`;
  async function solicitar(ruta, { method = 'GET', cookie, body } = {}) {
    const respuesta = await fetch(base + ruta, {
      method,
      headers: { ...(cookie ? { Cookie: cookie } : {}), ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    return { status: respuesta.status, datos: await respuesta.json(), cookie: respuesta.headers.get('set-cookie')?.split(';')[0] };
  }
  async function ingresar(correo, contrasena) {
    const respuesta = await solicitar('/login', { method: 'POST', body: { correo, contrasena } });
    assert.equal(respuesta.status, 200);
    assert.ok(respuesta.cookie);
    assert.equal(respuesta.datos.usuario.contrasenaHash, undefined);
    return respuesta;
  }

  assert.equal((await solicitar('/incidencias')).status, 401);
  assert.equal((await solicitar('/sesion')).datos.autenticado, false);
  assert.equal((await solicitar('/login', { method: 'POST', body: { correo: 'usuario@lab.local', contrasena: 'incorrecta' } })).status, 401);
  const dueno = await ingresar('usuario@lab.local', 'Usuario123!');
  const otro = await ingresar('otro@lab.local', 'Otro123!');
  const tecnico = await ingresar('tecnico@lab.local', 'Tecnico123!');
  assert.equal((await solicitar('/sesion', { cookie: dueno.cookie })).datos.autenticado, true);
  const equipoId = (await solicitar('/equipos', { cookie: dueno.cookie })).datos[0].id;
  const crear = body => solicitar('/incidencias', { method: 'POST', cookie: dueno.cookie, body });
  assert.equal((await crear({ equipoId, descripcion: 'x'.repeat(2001) })).status, 400);
  assert.equal((await crear({ equipoId: true, descripcion: 'Falla de monitor' })).status, 400);
  assert.equal((await crear({ equipoId: 999999, descripcion: 'Falla de monitor' })).status, 404);
  const creada = await crear({ equipoId, descripcion: 'El monitor no enciende', usuarioId: otro.datos.usuario.id });
  assert.equal(creada.status, 201);
  assert.equal(creada.datos.usuarioId, dueno.datos.usuario.id);
  assert.equal(creada.datos.equipo.id, equipoId);
  assert.equal(creada.datos.creador.id, dueno.datos.usuario.id);
  const cerrar = (id, cookie) => solicitar(`/incidencias/${id}/cerrar`, { method: 'PATCH', cookie });
  assert.equal((await cerrar(creada.datos.id, otro.cookie)).status, 403);
  const cierre = await cerrar(creada.datos.id, dueno.cookie);
  assert.equal(cierre.status, 200);
  assert.equal(cierre.datos.estado, 'cerrada');
  assert.ok(cierre.datos.fechaCierre);
  assert.equal((await cerrar(creada.datos.id, dueno.cookie)).status, 409);
  assert.equal((await cerrar('abc', tecnico.cookie)).status, 400);
  assert.equal((await cerrar(999999, tecnico.cookie)).status, 404);
  const segunda = await crear({ equipoId, descripcion: 'El teclado no funciona' });
  const simultaneos = await Promise.all([cerrar(segunda.datos.id, tecnico.cookie), cerrar(segunda.datos.id, tecnico.cookie)]);
  assert.deepEqual(simultaneos.map(r => r.status).sort(), [200, 409]);
  const listado = await solicitar('/incidencias', { cookie: tecnico.cookie });
  assert.equal(listado.datos.length, 2);
  assert.ok(listado.datos.every(i => i.estado === 'cerrada'));
  assert.equal((await solicitar('/logout', { method: 'POST', cookie: dueno.cookie })).status, 200);
  assert.equal((await solicitar('/incidencias', { cookie: dueno.cookie })).status, 401);
});
