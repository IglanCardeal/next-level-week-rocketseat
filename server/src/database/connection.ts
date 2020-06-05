import knex from 'knex';

const connectionConfig = {
  client: 'mysql2',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'ecoleta',
  },
};

const connection = knex(connectionConfig);

export default connection;
