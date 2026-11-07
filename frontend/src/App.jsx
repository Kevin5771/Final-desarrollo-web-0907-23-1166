import React, { useEffect, useState } from 'react';
import { api } from './api.js';

function Login({ onLogin }) {
  const [correo, setCorreo] = useState('usuario@lab.local');
  const [contrasena, setContrasena] = useState('Usuario123!');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function ingresar(e) {
    e.preventDefault();
    if (!correo.trim() || !e.currentTarget.elements.correo.validity.valid || !contrasena) {
      setError('Escribe un correo válido y tu contraseña.');
      e.currentTarget.querySelector(':invalid')?.focus();
      return;
    }
    setError(''); setCargando(true);
    try {
      const data = await api('/api/login', { method: 'POST', body: { correo, contrasena } });
      onLogin(data.usuario);
    } catch (e) { setError(e.message); }
    finally { setCargando(false); }
  }
  return <main className="login-wrap">
    <section className="login-card">
      <h1>Control de incidencias</h1>
      <p>Laboratorio de computación — Inicio de sesión</p>
      <form noValidate onSubmit={ingresar}>
        <label htmlFor="correo">Correo</label>
        <input id="correo" type="email" autoComplete="username" value={correo} onChange={e=>setCorreo(e.target.value)} required />
        <label htmlFor="contrasena">Contraseña</label>
        <input id="contrasena" type="password" autoComplete="current-password" value={contrasena} onChange={e=>setContrasena(e.target.value)} required />
        {error && <p className="alert error" role="alert">{error}</p>}
        <button disabled={cargando} type="submit" className="primary full">{cargando ? 'Ingresando...' : 'Ingresar'}</button>
      </form>
    </section>
  </main>;
}

function Panel({ usuario, onLogout }) {
  const [equipos, setEquipos] = useState([]);
  const [incidencias, setIncidencias] = useState([]);
  const [equipoId, setEquipoId] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  async function refrescar() {
    const [equiposCargados, incidenciasCargadas] = await Promise.all([
      api('/api/equipos'), api('/api/incidencias'),
    ]);
    setEquipos(equiposCargados);
    setIncidencias(incidenciasCargadas);
  }
  useEffect(() => {
    refrescar().catch(e => setError(e.message));
  }, []);

  async function registrar(e) {
    e.preventDefault();
    if (!equipoId || descripcion.trim().length < 5 || descripcion.trim().length > 2000) {
      setError('Selecciona un equipo y escribe una descripción de 5 a 2000 caracteres.');
      document.getElementById(!equipoId ? 'equipo' : 'descripcion').focus();
      return;
    }
    setError(''); setMensaje(''); setCargando(true);
    try {
      await api('/api/incidencias', { method: 'POST', body: { equipoId: Number(equipoId), descripcion } });
      setDescripcion(''); setEquipoId('');
      setMensaje('Incidencia registrada correctamente.');
      await refrescar();
    } catch (e) { setError(e.message); }
    finally { setCargando(false); }
  }
  async function cerrar(id) {
    setError(''); setMensaje(''); setCargando(true);
    try {
      await api(`/api/incidencias/${id}/cerrar`, { method: 'PATCH' });
      setMensaje('Incidencia cerrada correctamente.');
      await refrescar();
    } catch (e) { setError(e.message); }
    finally { setCargando(false); }
  }
  async function salir() {
    try { await api('/api/logout', { method: 'POST' }); onLogout(); }
    catch (e) { setError(e.message); }
  }

  const abiertas = incidencias.filter(i => i.estado === 'abierta').length;
  return <div className="dashboard">
    <header className="topbar">
      <strong>Laboratorio de computación</strong>
      <div className="user-info"><span>{usuario.nombre} ({usuario.rol === 'tecnico' ? 'Técnico' : 'Usuario'})</span><button className="secondary" disabled={cargando} onClick={salir}>Cerrar sesión</button></div>
    </header>
    <main className="container">
      <div className="page-heading">
        <h1>Control de incidencias</h1>
        <p>Incidencias abiertas: {abiertas}</p>
      </div>
      {error && <p className="alert error" role="alert">{error}</p>}
      {mensaje && <p className="alert success" role="status">{mensaje}</p>}
      <div className="content-grid">
        <section className="panel">
          <h2>Nueva incidencia</h2><p className="muted">Describe el problema encontrado.</p>
          <form noValidate onSubmit={registrar}>
            <label htmlFor="equipo">Equipo</label>
            <select id="equipo" value={equipoId} onChange={e => setEquipoId(e.target.value)} required>
              <option value="">Selecciona un equipo</option>
              {equipos.map(e => <option key={e.id} value={e.id}>{e.codigo} · {e.nombre}</option>)}
            </select>
            <label htmlFor="descripcion">Descripción</label>
            <textarea className="resize-none" style={{ resize: 'none' }} onInput={e => { e.currentTarget.style.height = 'auto'; e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px'; }} id="descripcion" value={descripcion} onChange={e=>setDescripcion(e.target.value)} rows="5" minLength="5" maxLength="2000" required placeholder="Ejemplo: el monitor no enciende" />
            <button disabled={cargando} type="submit" className="primary full">Registrar incidencia</button>
          </form>
          <p className="notice">Solo quien registró la incidencia o un usuario técnico puede cerrarla.</p>
        </section>
        <section className="panel incidents-panel">
          <div className="table-head"><div><h2>Incidencias registradas</h2><p className="muted">{incidencias.length} registros en total</p></div><button className="secondary" disabled={cargando} onClick={() => refrescar().catch(e => setError(e.message))}>Actualizar</button></div>
          {incidencias.length === 0 ? <p className="empty">Todavía no hay incidencias registradas.</p> :
            <div className="table-scroll"><table><thead><tr><th>Equipo</th><th>Descripción</th><th>Registró</th><th>Estado</th><th>Acción</th></tr></thead><tbody>
              {incidencias.map(i => {
                const puedeCerrar = i.estado === 'abierta' && (i.usuarioId === usuario.id || usuario.rol === 'tecnico');
                return <tr key={i.id}><td><strong>{i.equipo.codigo}</strong><small>{i.equipo.nombre}</small></td><td>{i.descripcion}</td><td>{i.creador.nombre}</td><td><span className={'status ' + i.estado}>{i.estado}</span></td><td>{puedeCerrar ? <button className="close-btn" disabled={cargando} onClick={() => cerrar(i.id)}>Cerrar</button> : <span className="dash">—</span>}</td></tr>;
              })}
            </tbody></table></div>}
        </section>
      </div>
    </main>
  </div>;
}

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [verificando, setVerificando] = useState(true);
  useEffect(() => {
    const volverAlLogin = () => setUsuario(null);
    window.addEventListener('sesion-vencida', volverAlLogin);
    return () => window.removeEventListener('sesion-vencida', volverAlLogin);
  }, []);
  useEffect(() => {
    api('/api/sesion')
      .then(data => { if (data.autenticado) setUsuario(data.usuario); })
      .catch(() => {})
      .finally(() => setVerificando(false));
  }, []);
  if (verificando) return <div className="loading">Cargando sesión…</div>;
  return usuario ? <Panel usuario={usuario} onLogout={() => setUsuario(null)} /> : <Login onLogin={setUsuario} />;
}
