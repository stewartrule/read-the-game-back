import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import entities from './app.entities';
import modules from './app.modules';
import config from './config/db';

export default [
  TypeOrmModule.forRoot({
    ...config,
    entities,
    synchronize: true,
  }),
  ...modules,
  GraphQLModule.forRoot({
    installSubscriptionHandlers: true,
    autoSchemaFile: 'schema.gql',
  }),
];
