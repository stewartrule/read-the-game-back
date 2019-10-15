import { Args, Query, Resolver } from '@nestjs/graphql';
import { FieldResolver, Root } from 'type-graphql';

import { Intercept } from '../intercept/intercept.entity';
import { Pass } from '../pass/pass.entity';
import { Shot } from '../shot/shot.entity';
import { GameFilter } from './dto/game.filter';
import { Game } from './game.entity';
import { GameService } from './game.service';

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
}
