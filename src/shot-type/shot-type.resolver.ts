import 'reflect-metadata';
import { Query, Resolver } from 'type-graphql';
import { ShotType } from './shot-type.entity';
import { ShotTypeService } from './shot-type.service';

@Resolver(() => ShotType)
export class ShotTypeResolver {
  constructor(private readonly shotTypeService: ShotTypeService) {}

  @Query(() => [ShotType])
  shotTypes(): Promise<ShotType[]> {
    return this.shotTypeService.find();
  }
}
