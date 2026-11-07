const path = require('path');
const fs = require('fs');
const { Sequelize } = require('sequelize');

const storage = process.env.DB_STORAGE || path.resolve(__dirname, '../../data/laboratorio.sqlite');
if (storage !== ':memory:') fs.mkdirSync(path.dirname(storage), { recursive: true });
const sequelize = new Sequelize({ dialect: 'sqlite', storage, logging: false });
module.exports = { sequelize };
