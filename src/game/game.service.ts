import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Intercept } from '../intercept/intercept.entity';
import { Shot } from '../shot/shot.entity';
import { Game } from './game.entity';
import { GameFilter } from './input/game.filter';

@Service()
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

  findByIntercept(intercept: Intercept): Promise<Game | undefined> {
    return this.gameRepository.findOne(intercept.gameId, {
      relations: [],
    });
  }

  findOne(game: Game): Promise<Game | undefined> {
    return this.gameRepository.findOne(game, {
      relations: ['awayTeam', 'shots.team', 'homeTeam'],
    });
  }
}
