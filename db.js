const Database = require("better-sqlite3");
require("dotenv").config();

const db = new Database(process.env.DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS bugs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titre TEXT NOT NULL,
    description TEXT NOT NULL,
    severite TEXT NOT NULL CHECK (severite IN ('basse', 'moyenne', 'haute')),
    statut TEXT NOT NULL DEFAULT 'ouvert' CHECK (statut IN ('ouvert', 'en_cours', 'resolu')),
    date_creation TEXT DEFAULT CURRENT_TIMESTAMP
);

`);

module.exports = db;
