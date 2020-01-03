import { ConnectionOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const config: ConnectionOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 8889,
  username: 'root',
  password: 'root',
  database: 'game',
  namingStrategy: new SnakeNamingStrategy(),
};

export default config;
