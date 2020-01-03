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

const getShotsInPeriod = (
  shots: Shot[],
  start: number,
  stop: number,
) =>
  shots.filter(shot => {
    const time = shot.happenedAt.valueOf();
    return time >= start && time < stop;
  });

export const getShotCountByPeriod = (
  game: Game,
  shots: Shot[],
  numPeriods = 6,
): TeamShotCountByPeriod[] => {
  const gameStart = game.startedAt.valueOf();
  const gameEnd = gameStart + 45 * 60 * 1000;
  const periodDuration = (gameEnd - gameStart) / numPeriods;

  return Array.from({ length: numPeriods }, (_, i) => {
    const start = gameStart + i * periodDuration;
    const stop = start + periodDuration;
    const periodShots = getShotsInPeriod(shots, start, stop);

    return {
      start: new Date(start),
      stop: new Date(stop),
      shots: periodShots,
      count: periodShots.length,
    };
  });
};
