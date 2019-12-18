import 'reflect-metadata';
import {
  Arg,
  Mutation,
  Publisher,
  PubSub,
  Resolver,
} from 'type-graphql';
import { Message, Topic } from '../app.messages';
import { Game } from '../game/game.entity';
import { GameService } from '../game/game.service';
import { Intercept } from '../intercept/intercept.entity';
import { InterceptService } from '../intercept/intercept.service';
import { CreateInterceptInput } from './input/create-intercept.input';

@Resolver(() => Game)
export class InterceptResolver {
  constructor(
    private readonly gameService: GameService,
    private readonly interceptService: InterceptService,
  ) {}

  @Mutation(returns => Intercept)
  async addIntercept(
    @Arg('data') input: CreateInterceptInput,
    @PubSub(Topic.Game)
    publish: Publisher<Message>,
  ): Promise<Intercept> {
    const intercept = await this.interceptService.create(input);
    const game = await this.gameService.findByIntercept(intercept);

    if (game) {
      publish({ game, intercept, type: 'intercept' });
    }

    return intercept;
  }
}
