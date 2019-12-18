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
import { Shot } from '../shot/shot.entity';
import { ShotService } from '../shot/shot.service';
import { CreateShotInput } from './input/create-shot.input';

@Resolver(() => Game)
export class ShotResolver {
  constructor(
    private readonly gameService: GameService,
    private readonly shotService: ShotService,
  ) {}

  @Mutation(returns => Shot)
  async addShot(
    @Arg('data') shotData: CreateShotInput,
    @PubSub(Topic.Game)
    publish: Publisher<Message>,
  ): Promise<Shot> {
    const shot = await this.shotService.create(shotData);
    const game = await this.gameService.findByShot(shot);

    if (game) {
      publish({ game, shot, type: 'shot' });
    }

    return shot;
  }
}
