import 'reflect-metadata';
import { Query, Resolver } from 'type-graphql';
import { PositionService } from './player.service';
import { Position } from './position.entity';

@Resolver(() => Position)
export class PositionResolver {
  constructor(private readonly positionService: PositionService) {}

  @Query(() => [Position])
  positions(): Promise<Position[]> {
    return this.positionService.find();
  }
}
