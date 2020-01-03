import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { PositionType } from './position-type.entity';

@Service()
export class PositionTypeService {
  constructor(
    @InjectRepository(PositionType)
    private readonly shotTypeRepository: Repository<PositionType>,
  ) {}

  find(): Promise<PositionType[]> {
    return this.shotTypeRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }
}
