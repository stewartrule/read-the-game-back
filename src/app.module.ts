import { Module } from '@nestjs/common';
import { Connection } from 'typeorm';

import appImports from './app.imports';

@Module({
  imports: appImports,
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
