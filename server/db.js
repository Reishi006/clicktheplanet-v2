const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'clicktheplanet-v2',
  multipleStatements: true,
});

module.exports = db;