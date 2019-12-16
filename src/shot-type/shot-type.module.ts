import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ShotType } from './shot-type.entity';
import { ShotTypeService } from './shot-type.service';
import { ShotTypeResolver } from './shot-type.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ShotType])],
  providers: [ShotTypeService, ShotTypeResolver],
  exports: [TypeOrmModule],
})
export class ShotTypeModule {}
