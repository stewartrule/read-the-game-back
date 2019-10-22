import { Args, Query, Resolver } from '@nestjs/graphql';
import { FieldResolver, Root } from 'type-graphql';

import { Intercept } from '../intercept/intercept.entity';
import { Pass } from '../pass/pass.entity';
import { Shot } from '../shot/shot.entity';
import { GameFilter } from './dto/game.filter';
import { Game } from './game.entity';
import { GameService } from './game.service';

import {
  ShotCountByPeriod,
  getShotCountByPeriod,
} from './object-type/shot-count-by-period';

import {
  AreaActionCount,
  getAreaActionCountByTeam,
} from './object-type/area-action-count';

@Resolver(() => Game)
export class GameResolver {
  constructor(private readonly gameService: GameService) {}

  @Query(() => [Game])
  games(@Args() filter: GameFilter): Promise<Game[]> {
    return this.gameService.find(filter);
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

  @FieldResolver(returns => AreaActionCount)
  async shotCountByArea(
    @Root() game: Game,
  ): Promise<AreaActionCount> {
    const shots = await game.shots;

    return {
      homeTeam: getAreaActionCountByTeam(shots, game.homeTeam),
      awayTeam: getAreaActionCountByTeam(shots, game.awayTeam),
    };
  }

  @FieldResolver(returns => AreaActionCount)
  async hitCountByArea(@Root() game: Game): Promise<AreaActionCount> {
    const shots = await game.shots;
    const hits = shots.filter(shot => shot.hit);

    return {
      homeTeam: getAreaActionCountByTeam(hits, game.homeTeam),
      awayTeam: getAreaActionCountByTeam(hits, game.awayTeam),
    };
  }

  @FieldResolver(returns => AreaActionCount)
  async passCountByArea(
    @Root() game: Game,
  ): Promise<AreaActionCount> {
    const passes = await game.passes;

    return {
      homeTeam: getAreaActionCountByTeam(passes, game.homeTeam),
      awayTeam: getAreaActionCountByTeam(passes, game.awayTeam),
    };
  }

  @FieldResolver(returns => ShotCountByPeriod)
  async shotCountByPeriod(@Root() game: Game) {
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
