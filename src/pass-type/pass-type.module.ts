import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PassType } from './pass-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PassType])],
})
export class PassTypeModule {}
