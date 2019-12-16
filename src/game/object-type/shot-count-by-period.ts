import { Field, ObjectType } from 'type-graphql';
import { Game } from '../../game/game.entity';
import { Shot } from '../../shot/shot.entity';
import { TeamShotCountByPeriod } from './team-shot-count-by-period';

@ObjectType()
export class ShotCountByPeriod {
  @Field(type => [TeamShotCountByPeriod])
  homeTeam!: TeamShotCountByPeriod[];

  @Field(type => [TeamShotCountByPeriod])
  awayTeam!: TeamShotCountByPeriod[];
}

export const getShotCountByPeriod = (
  game: Game,
  shots: Shot[],
  numPeriods = 6,
): TeamShotCountByPeriod[] => {
  const gameStart = game.start.valueOf();
  const gameEnd = gameStart + 45 * 60 * 1000;
  const periodDuration = (gameEnd - gameStart) / numPeriods;

  return Array.from({ length: numPeriods }, (_, i) => {
    const start = gameStart + i * periodDuration;
    const stop = start + periodDuration;
    const periodShots = shots.filter(shot => {
      const time = shot.time.valueOf();
      return time >= start && time < stop;
    });

    return {
      start: new Date(start),
      stop: new Date(stop),
      shots: periodShots,
      count: periodShots.length,
    };
  });
};
