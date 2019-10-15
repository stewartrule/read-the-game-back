import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Shot } from './shot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shot])],
  exports: [TypeOrmModule],
})
export class ShotModule {}
