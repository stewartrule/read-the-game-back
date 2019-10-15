import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed/seed.module';
import { Seed } from './seed/seed';

async function bootstrap() {
  const context = await NestFactory.createApplicationContext(
    SeedModule,
  );
  const seed = context.get(Seed);

  try {
    await seed.run();
  } catch (e) {
    console.error(e);
  } finally {
    context.close();
  }
}

bootstrap();
