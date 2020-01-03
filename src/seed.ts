import 'reflect-metadata';
import { Container } from 'typedi';
import * as TypeORM from 'typeorm';
import entities from './app.entities';
import config from './config/db';
import { Seed } from './seed/seed';

TypeORM.useContainer(Container);

async function bootstrap() {
  const orm = await TypeORM.createConnection({
    ...config,
    entities,
    synchronize: true,
    dropSchema: true,
  });

  const seed = Container.get(Seed);

  await seed.run();

  orm.close();
}

bootstrap();
