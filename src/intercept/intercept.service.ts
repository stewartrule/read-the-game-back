import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { CreateInterceptInput } from './input/create-intercept.input';
import { Intercept } from './intercept.entity';

@Service()
export class InterceptService {
  constructor(
    @InjectRepository(Intercept)
    private readonly interceptRepository: Repository<Intercept>,
  ) {}

  async create({
    gameId,
    fromPlayerId,
    fromTeamId,
    toPlayerId,
    toTeamId,
    x,
    y,
  }: CreateInterceptInput): Promise<Intercept> {
    const intercept = new Intercept();

    intercept.gameId = gameId;
    intercept.fromPlayerId = fromPlayerId;
    intercept.fromTeamId = fromTeamId;
    intercept.toPlayerId = toPlayerId;
    intercept.toTeamId = toTeamId;

    intercept.happenedAt = new Date();

    intercept.x = x;
    intercept.y = y;

    await this.interceptRepository.save(intercept);
    return intercept;
  }
}
