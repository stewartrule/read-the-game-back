import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TeamFilter } from './dto/team.filter';
import { Team } from './team.entity';

@Injectable()
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
