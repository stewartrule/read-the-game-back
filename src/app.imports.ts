import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import entities from './app.entities';
import modules from './app.modules';

export default [
  TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 8889,
    username: 'root',
    password: 'root',
    database: 'game',
    entities: [...entities],
    synchronize: true,
  }),
  ...modules,
  GraphQLModule.forRoot({
    installSubscriptionHandlers: true,
    autoSchemaFile: 'schema.gql',
  }),
];
