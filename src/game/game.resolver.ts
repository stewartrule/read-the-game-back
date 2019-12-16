import {
  Args,
  Subscription,
  Query,
  Resolver,
  Mutation,
  // Root,
} from '@nestjs/graphql';

import { FieldResolver, Root } from 'type-graphql';

import { Intercept } from '../intercept/intercept.entity';
import { Pass } from '../pass/pass.entity';
import { Shot } from '../shot/shot.entity';
import { Team } from '../team/team.entity';
import { ShotService } from '../shot/shot.service';
import { GameFilter } from './dto/game.filter';
import { AddShotInput } from './dto/game.add-shot';
import { Game } from './game.entity';
import { GameService } from './game.service';

import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

enum Channel {
  ShotAdded = 'ShotAdded',
}

import {
  ShotCountByPeriod,
  getShotCountByPeriod,
} from './object-type/shot-count-by-period';

import {
  PlayerAction,
  AreaActionCount,
  getAreaActionCountByTeam,
} from './object-type/area-action-count';

@Resolver(() => Game)
export class GameResolver {
  constructor(
    private readonly gameService: GameService,
    private readonly shotService: ShotService,
  ) {}

  @Query(() => [Game])
  games(@Args() filter: GameFilter): Promise<Game[]> {
    return this.gameService.find(filter);
  }

  @Mutation(returns => Shot)
  async addShot(@Args('data') shotData: AddShotInput): Promise<Shot> {
    const shot = await this.shotService.create(shotData);
    const game = await this.gameService.findByShot(shot);

    if (game) {
      await pubSub.publish('ShotAdded', { shotAdded: shot });

      await pubSub.publish('GameUpdated', {
        gameUpdated: game,
      });

      await pubSub.publish('ShotCountByPeriodUpdated', {
        shotCountByPeriodUpdated: game,
      });

      await pubSub.publish('TeamUpdated', {
        teamUpdated:
          game.awayTeam.id === shot.teamId
            ? game.awayTeam
            : game.homeTeam,
      });
    }

    return shot;
  }

  @Subscription(returns => Game)
  gameUpdated() {
    return pubSub.asyncIterator('GameUpdated');
  }

  @Subscription(returns => Shot)
  shotAdded() {
    return pubSub.asyncIterator('ShotAdded');
  }

  @Subscription(returns => Team)
  teamUpdated() {
    return pubSub.asyncIterator('TeamUpdated');
  }

  @Subscription(returns => Game)
  shotCountByPeriodUpdated() {
    return pubSub.asyncIterator('ShotCountByPeriodUpdated');
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

  private getGameActionCount(game: Game, actions: PlayerAction[]) {
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
