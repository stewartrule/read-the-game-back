import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Intercept } from './intercept.entity';
import { InterceptService } from './intercept.service';

@Module({
  imports: [TypeOrmModule.forFeature([Intercept])],
  providers: [InterceptService],
  exports: [TypeOrmModule],
})
export class InterceptModule {}
