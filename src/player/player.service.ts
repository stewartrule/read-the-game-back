import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './player.entity';

@Injectable()
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
