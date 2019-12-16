import 'reflect-metadata';
import {
  Args,
  FieldResolver,
  Int,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { Game } from '../game/game.entity';
import { TeamFilter } from './dto/team.filter';
import { Team } from './team.entity';
import { TeamService } from './team.service';

@Resolver(() => Team)
export class TeamResolver {
  constructor(private readonly teamService: TeamService) {}

  @Query(returns => [Team])
  teams(@Args() filter: TeamFilter): Promise<Team[]> {
    return this.teamService.find(filter);
  }

  @Query(returns => [Team])
  teamActivity(@Args() filter: TeamFilter): Promise<Team[]> {
    return this.teamService.find(filter);
  }

  @FieldResolver(returns => Int)
  async passCount(@Root() team: Team) {
    const passes = await team.passes;
    return passes.length;
  }

  @FieldResolver(returns => Int)
  async shotCount(@Root() team: Team) {
    const shots = await team.shots;
    return shots.length;
  }

  @FieldResolver(returns => Int)
  async hitCount(@Root() team: Team) {
    const shots = await team.shots;
    return shots.filter(({ hit }) => hit).length;
  }

  // @fixme
  @FieldResolver(returns => Int)
  async involvedPlayerCount(@Root() team: Team) {
    const shots = await team.shots;
    const hits = shots.filter(({ hit }) => hit);

    return hits
      .map(hit => hit.playerId)
      .filter((value, index, self) => {
        return self.indexOf(value) === index;
      }).length;
  }

  // @fixme
  @FieldResolver(returns => Int)
  async averageStrength(@Root() { players }: Team) {
    const sum = players.reduce(
      (sum, player) => sum + player.strength,
      0,
    );

    return Math.round(sum / players.length);
  }

  @FieldResolver(returns => Int)
  async interceptCount(@Root() team: Team) {
    const intercepts = await team.intercepts;
    return intercepts.length;
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
