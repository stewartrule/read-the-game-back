import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Intercept } from './intercept.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Intercept])],
})
export class InterceptModule {}
