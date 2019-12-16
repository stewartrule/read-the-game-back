import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Shot } from './shot.entity';
import { ShotService } from './shot.service';

@Module({
  imports: [TypeOrmModule.forFeature([Shot])],
  providers: [ShotService],
  exports: [TypeOrmModule],
})
export class ShotModule {}
