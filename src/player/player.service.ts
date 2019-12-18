import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Player } from './player.entity';

@Service()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  find(): Promise<Player[]> {
    return this.playerRepository.find({
      order: {
        height: 'ASC',
        lastName: 'ASC',
      },
    });
  }

  findOne(id: number): Promise<Player | undefined> {
    return this.playerRepository.findOne(id);
  }
}
