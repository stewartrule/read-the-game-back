import { Module } from '@nestjs/common';
import { Connection } from 'typeorm';

import appImports from '../app.imports';
import { Seed } from './seed';

@Module({
  imports: appImports,
  providers: [Seed],
})
export class SeedModule {
  constructor(private readonly connection: Connection) {}
}
