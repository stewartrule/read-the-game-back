import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Position } from './position.entity';

@Service()
export class PositionService {
  constructor(
    @InjectRepository(Position)
    private readonly positionRepository: Repository<Position>,
  ) {}

  find(): Promise<Position[]> {
    return this.positionRepository.find({});
  }

  findOne(id: number): Promise<Position | undefined> {
    return this.positionRepository.findOne(id);
  }
}
