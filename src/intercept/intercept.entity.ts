import { Field, ID, Int, ObjectType } from 'type-graphql';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Game } from '../game/game.entity';
import { Player } from '../player/player.entity';
import { Team } from '../team/team.entity';

@Entity({ orderBy: { time: 'ASC' } })
@ObjectType()
export class Intercept {
  @Field(type => ID)
  @PrimaryGeneratedColumn({ unsigned: true })
  id!: number;

  @Field(type => Date)
  @Column()
  time!: Date;

  @Field(type => Game)
  @ManyToOne(type => Game, game => game.intercepts)
  game!: Game;

  @Field(type => Player)
  @ManyToOne(type => Player, player => player.intercepts)
  player!: Player;

  @Field(type => Team)
  @ManyToOne(type => Team, team => team.intercepts)
  team!: Team;

  @Field(type => Int)
  @Column({ unsigned: true, type: 'tinyint' })
  x!: number;

  @Field(type => Int)
  @Column({ unsigned: true, type: 'tinyint' })
  y!: number;
}
