import { ApolloServer } from 'apollo-server';
import * as fs from 'fs';
import { printSchema } from 'graphql';
import * as path from 'path';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import * as TypeORM from 'typeorm';
import entities from './app.entities';
import resolvers from './app.resolvers';
import config from './config/db';

TypeORM.useContainer(Container);

async function bootstrap() {
  await TypeORM.createConnection({
    ...config,
    entities,
    synchronize: true,
  });

  const schema = await buildSchema({
    resolvers,
    container: Container,
  });

  fs.writeFile(
    path.join(__dirname, '../schema.gql'),
    printSchema(schema),
    () => {},
  );

  const server = new ApolloServer({
    schema,
    playground: true,
  });

  const { url } = await server.listen(3000);

  console.log(
    `Server is running, GraphQL Playground available at ${url}`,
  );
}

bootstrap();
