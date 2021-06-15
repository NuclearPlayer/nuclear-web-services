export const config = {
  development: {
    username: 'root',
    password: 'password',
    database: 'sequelize.sqlite',
    host: 'localhost',
    dialect: 'sqlite',
  },
  test: {
    username: 'root',
    password: 'password',
    database: 'sequelize-test.sqlite',
    host: 'localhost',
    dialect: 'sqlite',
  },
  production: {
    database: process.env.DATABASE_URL,
    dialect: 'postgres',
    protocol: 'postgres',
  },
};
