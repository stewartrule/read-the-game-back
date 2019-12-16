import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Intercept } from './intercept.entity';

@Service()
export class InterceptService {
  constructor(
    @InjectRepository(Intercept)
    private readonly interceptRepository: Repository<Intercept>,
  ) {}
}
