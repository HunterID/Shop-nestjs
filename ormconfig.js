module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: ['dist/**/**/*.model.js'],
  migrations: ['dist/migrations/*.js'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: './migrations',
  },
};
