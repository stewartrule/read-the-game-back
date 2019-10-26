import { Field, ObjectType } from 'type-graphql';

import { Team } from '../../team/team.entity';
import { ActionCount } from './action-count';

type Action = {
  x: number;
  y: number;
  teamId: number;
  time: Date;
};

type TeamActionCount = ActionCount[];

@ObjectType()
export class AreaActionCount {
  @Field(type => [ActionCount])
  homeTeam!: TeamActionCount;

  @Field(type => [ActionCount])
  awayTeam!: TeamActionCount;
}

function replace<T>(arr: T[], index: number, value: T): T[] {
  const copy = arr.slice();
  copy.splice(index, 1, value);
  return copy;
}

const AreaX = 120 / 5;
const AreaY = 90 / 3;

export const getAreaActionCountByTeam = (
  actions: Action[],
  team: Team,
): TeamActionCount =>
  actions
    .filter(({ teamId }) => teamId === team.id)
    .reduce(
      (stats, action) => {
        const x = Math.ceil(action.x / AreaX);
        const y = Math.ceil(action.y / AreaY);

        const index = stats.findIndex(
          stat => stat.x === x && stat.y === y,
        );

        return index > -1
          ? replace(stats, index, {
              x,
              y,
              time: action.time,
              teamId: action.teamId,
              count: stats[index].count + 1,
            })
          : stats.concat([
              {
                x,
                y,
                time: action.time,
                teamId: action.teamId,
                count: 1,
              },
            ]);
      },
      [] as ActionCount[],
    );
