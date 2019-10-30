import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import entities from '../app.entities';
import modules from '../app.modules';
import config from '../config/db';
import { Seed } from './seed';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...config,
      entities,
      synchronize: true,
      dropSchema: true,
    }),
    ...modules,
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
    }),
  ],
  providers: [Seed],
})
export class SeedModule {
  constructor(private readonly connection: Connection) {}
}
