import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Shot } from './shot.entity';

type CreateShot = {
  gameId: number;
  playerId: number;
  teamId: number;
  shotTypeId: number;
  hit: boolean;
};

@Service()
export class ShotService {
  constructor(
    @InjectRepository(Shot)
    private readonly shotRepository: Repository<Shot>,
  ) {}

  async create({
    gameId,
    playerId,
    teamId,
    shotTypeId,
    hit,
  }: CreateShot): Promise<Shot> {
    const shot = new Shot();

    shot.gameId = gameId;
    shot.playerId = playerId;
    shot.teamId = teamId;
    shot.typeId = shotTypeId;

    shot.time = new Date();

    shot.onTarget = hit;
    shot.hit = hit;
    shot.out = hit ? false : Math.random() > 0.5;
    shot.x = Math.floor(Math.random() * 120);
    shot.y = Math.floor(Math.random() * 90);

    await this.shotRepository.save(shot);
    return shot;
  }
}
