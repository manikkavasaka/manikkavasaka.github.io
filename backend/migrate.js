const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const migrate = async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to Neon Database. Starting migration...');

    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    await client.query(sql);
    console.log('Migration successful! All tables created.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
};

migrate();
