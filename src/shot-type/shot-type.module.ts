import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ShotType } from './shot-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShotType])],
  exports: [TypeOrmModule],
})
export class ShotTypeModule {}
