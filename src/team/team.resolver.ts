import { Args, Query, Resolver } from '@nestjs/graphql';

import { FieldResolver, Root } from 'type-graphql';

import { TeamFilter } from './dto/team.filter';
import { Game } from '../game/game.entity';
import { Team } from './team.entity';
import { TeamService } from './team.service';

@Resolver(() => Team)
export class TeamResolver {
  constructor(private readonly teamService: TeamService) {}

  @Query(() => [Team])
  teams(@Args() filter: TeamFilter): Promise<Team[]> {
    return this.teamService.find(filter);
  }

  @FieldResolver(returns => [Game])
  async awayGames(@Root() team: Team) {
    return await team.awayGames;
  }

  @FieldResolver(returns => [Game])
  async homeGames(@Root() team: Team) {
    return await team.homeGames;
  }
}
