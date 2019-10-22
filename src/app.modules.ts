import { GameModule } from './game/game.module';
import { InterceptModule } from './intercept/intercept.module';
import { PassTypeModule } from './pass-type/pass-type.module';
import { PassModule } from './pass/pass.module';
import { PlayerModule } from './player/player.module';
import { ShotTypeModule } from './shot-type/shot-type.module';
import { ShotModule } from './shot/shot.module';
import { TeamModule } from './team/team.module';

export default [
  GameModule,
  InterceptModule,
  PassModule,
  PassTypeModule,
  PlayerModule,
  ShotModule,
  ShotTypeModule,
  TeamModule,
];
