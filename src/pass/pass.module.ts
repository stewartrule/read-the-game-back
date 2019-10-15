import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Pass } from './pass.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pass])],
})
export class PassModule {}