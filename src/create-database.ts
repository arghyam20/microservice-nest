import { config } from 'dotenv';
import { createConnection } from 'mysql2/promise';

config({ path: '.env' });

async function bootstrap() {
  const database = process.env.DB_DATABASE || 'nestjs_api';
  const connection = await createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: false,
  });

  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${database.replace(/`/g, '``')}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );
    console.log(`Database ready: ${database}`);
  } finally {
    await connection.end();
  }
}

bootstrap().catch((error) => {
  console.error('Database creation failed:', error);
  process.exit(1);
});
