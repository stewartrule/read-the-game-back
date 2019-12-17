import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { CreatePassInput } from './input/create-pass.input';
import { Pass } from './pass.entity';

@Service()
export class PassService {
  constructor(
    @InjectRepository(Pass)
    private readonly passRepository: Repository<Pass>,
  ) {}

  async create({
    gameId,
    fromPlayerId,
    toPlayerId,
    teamId,
  }: CreatePassInput): Promise<Pass> {
    const pass = new Pass();

    pass.gameId = gameId;
    pass.teamId = teamId;
    pass.fromPlayerId = fromPlayerId;
    pass.toPlayerId = toPlayerId;

    pass.time = new Date();

    await this.passRepository.save(pass);
    return pass;
  }
}
