import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Game } from './game.entity';
import { GameResolver } from './game.resolver';
import { GameService } from './game.service';
import { ShotModule } from '../shot/shot.module';
import { ShotService } from '../shot/shot.service';
import { Shot } from '../shot/shot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Game]), ShotModule],
  providers: [GameService, GameResolver, ShotService],
  exports: [TypeOrmModule],
})
export class GameModule {}
