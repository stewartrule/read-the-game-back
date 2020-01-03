import 'reflect-metadata';
import { Query, Resolver } from 'type-graphql';
import { PositionType } from './position-type.entity';
import { PositionTypeService } from './position-type.service';

@Resolver(() => PositionType)
export class PositionTypeResolver {
  constructor(
    private readonly shotTypeService: PositionTypeService,
  ) {}

  @Query(() => [PositionType])
  shotTypes(): Promise<PositionType[]> {
    return this.shotTypeService.find();
  }
}
