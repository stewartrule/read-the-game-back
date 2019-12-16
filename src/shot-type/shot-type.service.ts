import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ShotType } from './shot-type.entity';

@Injectable()
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
