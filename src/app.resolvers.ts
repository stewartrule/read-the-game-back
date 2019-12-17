import { GameResolver } from './game/game.resolver';
import { InterceptResolver } from './intercept/intercept.resolver';
import { PlayerResolver } from './player/player.resolver';
import { ShotTypeResolver } from './shot-type/shot-type.resolver';
import { ShotResolver } from './shot/shot.resolver';
import { TeamResolver } from './team/team.resolver';

export default [
  GameResolver,
  InterceptResolver,
  PlayerResolver,
  ShotResolver,
  ShotTypeResolver,
  TeamResolver,
];
