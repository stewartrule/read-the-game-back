import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GameFilter } from './dto/game.filter';
import { Game } from './game.entity';
import { Shot } from '../shot/shot.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
  ) {}

  find({ take, skip }: GameFilter): Promise<Game[]> {
    return this.gameRepository.find({
      take,
      skip,
    });
  }

  findByShot(shot: Shot): Promise<Game | undefined> {
    return this.gameRepository.findOne(shot.gameId, {
      relations: [],
    });
  }

  findOne(game: Game): Promise<Game | undefined> {
    return this.gameRepository.findOne(game, {
      relations: ['awayTeam', 'shots.team', 'homeTeam'],
    });
  }
}
