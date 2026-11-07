const express = require('express');
const cors = require('cors');
const session = require('express-session');
const rutas = require('./routes');
const manejarError = require('./middlewares/manejarError');
const app = express();
app.disable('x-powered-by');
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '20kb' }));
app.use(session({
  name: 'lab.sid',
  secret: process.env.SESSION_SECRET || 'solo-desarrollo-cambia-esta-clave',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 8 },
}));
app.use('/api', rutas);
app.use(manejarError);
module.exports = { app };
