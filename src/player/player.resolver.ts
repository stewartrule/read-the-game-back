import 'reflect-metadata';
import {
  FieldResolver,
  Int,
  Query,
  Resolver,
  ResolverInterface,
  Root,
} from 'type-graphql';
import { Shot } from '../shot/shot.entity';
import { Player } from './player.entity';
import { PlayerService } from './player.service';

@Resolver(() => Player)
export class PlayerResolver implements ResolverInterface<Player> {
  constructor(private readonly playerService: PlayerService) {}

  @Query(() => [Player])
  players(): Promise<Player[]> {
    return this.playerService.find();
  }

  @FieldResolver(returns => [Shot])
  async shots(@Root() player: Player) {
    return await player.shots;
  }

  @FieldResolver(returns => Int)
  async shotCount(@Root() player: Player) {
    const shots = await player.shots;

    return shots.length;
  }

  @FieldResolver(returns => Int)
  async hitCount(@Root() player: Player) {
    const shots = await player.shots;

    return shots.filter(shot => shot.hit).length;
  }
}
