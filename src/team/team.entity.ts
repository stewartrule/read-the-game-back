import { Field, ID, ObjectType } from 'type-graphql';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Game } from '../game/game.entity';
import { Player } from '../player/player.entity';

@Entity()
@ObjectType()
export class Team {
  @Field(type => ID)
  @PrimaryGeneratedColumn({ unsigned: true })
  id!: number;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column({ length: 16 })
  abbr!: string;

  @Field(type => [Game])
  @OneToMany(type => Game, game => game.awayTeam)
  awayGames!: Promise<Game[]>;

  @Field(type => [Game])
  @OneToMany(type => Game, game => game.homeTeam)
  homeGames!: Promise<Game[]>;

  @Field(type => [Player])
  @OneToMany(type => Player, player => player.team, {
    cascade: true,
    eager: true,
  })
  players!: Player[];
}
