import { Field, ObjectType } from 'type-graphql';
import { Game } from '../../game/game.entity';
import { Team } from '../../team/team.entity';
import { PlayerAction } from '../../types';
import { TeamAreaActionCount } from './team-area-action-count';

type TeamActionCount = TeamAreaActionCount[];

@ObjectType()
export class GameActionCount {
  @Field(type => [TeamAreaActionCount])
  homeTeam!: TeamActionCount;

  @Field(type => [TeamAreaActionCount])
  awayTeam!: TeamActionCount;
}

function replace<T>(input: T[], index: number, value: T): T[] {
  const output = input.slice();
  output.splice(index, 1, value);
  return output;
}

const AreaX = 120 / 5;
const AreaY = 90 / 3;

export const getPlayerActionCount = (
  actions: PlayerAction[],
): TeamAreaActionCount[] =>
  actions.reduce((actionCounts, action) => {
    const x = Math.ceil(action.x / AreaX);
    const y = Math.ceil(action.y / AreaY);

    const index = actionCounts.findIndex(
      stat => stat.x === x && stat.y === y,
    );

    if (index > -1) {
      const actionCount = actionCounts[index];

      return replace(actionCounts, index, {
        x,
        y,
        happenedAt: action.happenedAt,
        fromTeamId: action.fromTeamId,
        count: actionCount.count + 1,
        fromPlayerIds: actionCount.fromPlayerIds.includes(
          action.fromPlayerId,
        )
          ? actionCount.fromPlayerIds
          : actionCount.fromPlayerIds.concat([action.fromPlayerId]),
      });
    }

    return actionCounts.concat([
      {
        x,
        y,
        happenedAt: action.happenedAt,
        fromTeamId: action.fromTeamId,
        count: 1,
        fromPlayerIds: [action.fromPlayerId],
      },
    ]);
  }, [] as TeamAreaActionCount[]);

export const getTeamActionCount = (
  actions: PlayerAction[],
  team: Team,
): TeamActionCount =>
  getPlayerActionCount(
    actions.filter(({ fromTeamId }) => fromTeamId === team.id),
  );

export const getGameActionCount = (
  game: Game,
  actions: PlayerAction[],
): GameActionCount => {
  return {
    homeTeam: getTeamActionCount(actions, game.homeTeam),
    awayTeam: getTeamActionCount(actions, game.awayTeam),
  };
};
