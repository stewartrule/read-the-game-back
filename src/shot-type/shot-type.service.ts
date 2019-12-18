import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { ShotType } from './shot-type.entity';

@Service()
export class ShotTypeService {
  constructor(
    @InjectRepository(ShotType)
    private readonly shotTypeRepository: Repository<ShotType>,
  ) {}

  find(): Promise<ShotType[]> {
    return this.shotTypeRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }
}
