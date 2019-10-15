import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GameFilter } from './dto/game.filter';
import { Game } from './game.entity';

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
}
