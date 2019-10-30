import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Player } from './player.entity';
import { PlayerService } from './player.service';
import { PlayerResolver } from './player.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Player])],
  providers: [PlayerService, PlayerResolver],
  exports: [TypeOrmModule],
})
export class PlayerModule {}
