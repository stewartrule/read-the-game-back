import 'reflect-metadata';
import {
  Args,
  FieldResolver,
  Query,
  Resolver,
  Root,
  Subscription,
} from 'type-graphql';
import {
  filterByType,
  Message,
  ShotAddedMessage,
  Topic,
} from '../app.messages';
import { Intercept } from '../intercept/intercept.entity';
import { Pass } from '../pass/pass.entity';
import { Shot } from '../shot/shot.entity';
import { Team } from '../team/team.entity';
import { Game } from './game.entity';
import { GameService } from './game.service';
import { GameFilter } from './input/game.filter';
import {
  AreaActionCount,
  getAreaActionCountByTeam,
  PlayerAction,
} from './object-type/area-action-count';
import {
  getShotCountByPeriod,
  ShotCountByPeriod,
} from './object-type/shot-count-by-period';

@Resolver(() => Game)
export class GameResolver {
  constructor(private readonly gameService: GameService) {}

  @Query(() => [Game])
  games(@Args() filter: GameFilter): Promise<Game[]> {
    return this.gameService.find(filter);
  }

  @Subscription(returns => Game, {
    topics: [Topic.Game],
  })
  gameUpdated(@Root() { game }: Message): Game {
    return game;
  }

  @Subscription(returns => Shot, {
    topics: [Topic.Game],
    filter: filterByType('shot'),
  })
  shotAdded(@Root() { shot }: ShotAddedMessage): Shot {
    return shot;
  }

  @Subscription(returns => Team, {
    topics: [Topic.Game],
  })
  teamUpdated(@Root() { game, shot }: ShotAddedMessage): Team {
    return game.awayTeam.id === shot.teamId
      ? game.awayTeam
      : game.homeTeam;
  }

  @FieldResolver(returns => [Shot])
  async shots(@Root() game: Game) {
    return await game.shots;
  }

  @FieldResolver(returns => [Intercept])
  async intercepts(@Root() game: Game) {
    return await game.intercepts;
  }

  @FieldResolver(returns => [Pass])
  async passes(@Root() game: Game) {
    return await game.passes;
  }

  @FieldResolver(returns => [Shot])
  async homeTeamShots(@Root() game: Game) {
    const shots = await game.shots;

    return shots.filter(shot => shot.teamId === game.homeTeam.id);
  }

  @FieldResolver(returns => [Shot])
  async awayTeamShots(@Root() game: Game) {
    const shots = await game.shots;

    return shots.filter(shot => shot.teamId === game.awayTeam.id);
  }

  @FieldResolver(returns => AreaActionCount)
  async shotCountByArea(
    @Root() game: Game,
  ): Promise<AreaActionCount> {
    const shots = await game.shots;

    return this.getGameActionCount(game, shots);
  }

  @FieldResolver(returns => AreaActionCount)
  async hitCountByArea(@Root() game: Game): Promise<AreaActionCount> {
    const shots = await game.shots;
    const hits = shots.filter(shot => shot.hit);

    return this.getGameActionCount(game, hits);
  }

  @FieldResolver(returns => AreaActionCount)
  async passCountByArea(
    @Root() game: Game,
  ): Promise<AreaActionCount> {
    const passes = await game.passes;

    return this.getGameActionCount(game, passes);
  }

  private getGameActionCount(
    game: Game,
    actions: PlayerAction[],
  ): AreaActionCount {
    return {
      homeTeam: getAreaActionCountByTeam(actions, game.homeTeam),
      awayTeam: getAreaActionCountByTeam(actions, game.awayTeam),
    };
  }

  @FieldResolver(returns => ShotCountByPeriod)
  async shotCountByPeriod(
    @Root() game: Game,
  ): Promise<ShotCountByPeriod> {
    const shots = await game.shots;

    const home = shots.filter(
      ({ teamId }) => teamId === game.homeTeam.id,
    );

    const away = shots.filter(
      ({ teamId }) => teamId === game.awayTeam.id,
    );

    return {
      homeTeam: getShotCountByPeriod(game, home),
      awayTeam: getShotCountByPeriod(game, away),
    };
  }
}
