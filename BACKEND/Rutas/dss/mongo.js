const mongoose = require('mongoose');

function getCol(name) {
  const db = mongoose.connection.db;
  if (!db) throw new Error('DB not connected');
  return db.collection(name);
}

module.exports = { getCol };
