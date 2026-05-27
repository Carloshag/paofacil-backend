const { Sequelize } = require('sequelize');
const path = require('path');

let sequelize;

if (process.env.DATABASE_URL) {
  // Conexão com PostgreSQL na nuvem (Neon/Supabase)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Necessário para a maioria dos provedores na nuvem
      }
    }
  });
} else {
  // Fallback local usando SQLite
  const storagePath = process.env.DATABASE_PATH || path.join(__dirname, '..', 'database.sqlite');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: storagePath,
    logging: false,
  });
}

module.exports = sequelize;
