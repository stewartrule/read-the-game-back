import 'reflect-metadata';
import {
  Args,
  FieldResolver,
  Query,
  Resolver,
  Root,
  Subscription,
  Int,
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
  GameActionCount,
  getGameActionCount,
} from './object-type/game-action-count';
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
    return game.awayTeam.id === shot.fromTeamId
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

  async getHomeTeamShots(game: Game) {
    const shots = await game.shots;

    return shots.filter(shot => shot.fromTeamId === game.homeTeam.id);
  }

  async getAwayTeamShots(game: Game) {
    const shots = await game.shots;

    return shots.filter(shot => shot.fromTeamId === game.awayTeam.id);
  }

  @FieldResolver(returns => [Shot])
  async homeTeamShots(@Root() game: Game) {
    return this.getHomeTeamShots(game);
  }

  @FieldResolver(returns => [Shot])
  async awayTeamShots(@Root() game: Game) {
    return this.getAwayTeamShots(game);
  }

  @FieldResolver(returns => Int)
  async awayTeamScore(@Root() game: Game) {
    const shots = await this.getAwayTeamShots(game);

    return shots.filter(shot => shot.hit).length;
  }

  @FieldResolver(returns => Int)
  async homeTeamScore(@Root() game: Game) {
    const shots = await this.getHomeTeamShots(game);

    return shots.filter(shot => shot.hit).length;
  }

  @FieldResolver(returns => GameActionCount)
  async shotCountByArea(
    @Root() game: Game,
  ): Promise<GameActionCount> {
    const shots = await game.shots;

    return getGameActionCount(game, shots);
  }

  @FieldResolver(returns => GameActionCount)
  async hitCountByArea(@Root() game: Game): Promise<GameActionCount> {
    const shots = await game.shots;
    const hits = shots.filter(shot => shot.hit);

    return getGameActionCount(game, hits);
  }

  @FieldResolver(returns => GameActionCount)
  async passCountByArea(
    @Root() game: Game,
  ): Promise<GameActionCount> {
    const passes = await game.passes;

    return getGameActionCount(game, passes);
  }

  @FieldResolver(returns => ShotCountByPeriod)
  async shotCountByPeriod(
    @Root() game: Game,
  ): Promise<ShotCountByPeriod> {
    const shots = await game.shots;

    const home = shots.filter(
      ({ fromTeamId }) => fromTeamId === game.homeTeam.id,
    );

    const away = shots.filter(
      ({ fromTeamId }) => fromTeamId === game.awayTeam.id,
    );

    return {
      homeTeam: getShotCountByPeriod(game, home),
      awayTeam: getShotCountByPeriod(game, away),
    };
  }
}
