import { Field, ID, ObjectType, Int } from 'type-graphql';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationCount
} from 'typeorm';

import { Game } from '../game/game.entity';
import { Intercept } from '../intercept/intercept.entity';
import { Pass } from '../pass/pass.entity';
import { Player } from '../player/player.entity';
import { Shot } from '../shot/shot.entity';

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

  @Field(type => [Shot])
  @OneToMany(type => Shot, shot => shot.team, {
    cascade: true,
  })
  shots!: Promise<Shot[]>;

  @Field(type => [Pass])
  @OneToMany(type => Pass, pass => pass.team, {
    cascade: true,
  })
  passes!: Promise<Pass[]>;

  @Field(type => [Intercept])
  @OneToMany(type => Intercept, intercept => intercept.team, {
    cascade: true,
  })
  intercepts!: Promise<Intercept[]>;
}
