const auth = require('../services/auth.service');
async function sesion(req, res, next) {
  try {
    const usuario = await auth.consultarSesion(req.session.usuarioId);
    res.json(usuario ? { autenticado: true, usuario } : { autenticado: false });
  } catch (error) { next(error); }
}
async function login(req, res, next) {
  try {
    const usuario = await auth.autenticar(req.body || {});
    req.session.regenerate(error => {
      if (error) return next(error);
      req.session.usuarioId = usuario.id;
      req.session.rol = usuario.rol;
      req.session.save(error => {
        if (error) return next(error);
        res.json({ usuario });
      });
    });
  } catch (error) { next(error); }
}
function logout(req, res, next) {
  req.session.destroy(error => {
    if (error) return next(error);
    res.clearCookie('lab.sid', { httpOnly: true, sameSite: 'lax', secure: false });
    res.json({ mensaje: 'Sesión cerrada.' });
  });
}
module.exports = { sesion, login, logout };
