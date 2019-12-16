import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Intercept } from './intercept.entity';

@Injectable()
export class InterceptService {
  constructor(
    @InjectRepository(Intercept)
    private readonly interceptRepository: Repository<Intercept>,
  ) {}
}
