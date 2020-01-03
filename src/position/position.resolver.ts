import 'reflect-metadata';
import { Query, Resolver } from 'type-graphql';
import { Position } from './position.entity';
import { PositionService } from './position.service';

@Resolver(() => Position)
export class PositionResolver {
  constructor(private readonly positionService: PositionService) {}

  @Query(() => [Position])
  positions(): Promise<Position[]> {
    return this.positionService.find();
  }
}
