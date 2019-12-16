import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { TeamFilter } from './dto/team.filter';
import { Team } from './team.entity';

@Service()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  find({ take, skip }: TeamFilter): Promise<Team[]> {
    return this.teamRepository.find({
      take,
      skip,
    });
  }
}
