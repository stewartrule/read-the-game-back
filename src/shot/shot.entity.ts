import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Game } from '../game/game.entity';
import { Player } from '../player/player.entity';
import { ShotType } from '../shot-type/shot-type.entity';
import { Team } from '../team/team.entity';

import { Field, ID, ObjectType, Int } from 'type-graphql';

@Entity({ orderBy: { time: 'ASC' } })
@ObjectType()
export class Shot {
  @Field(type => ID)
  @PrimaryGeneratedColumn({ unsigned: true })
  id!: number;

  @Field(type => Date)
  @Column()
  time!: Date;

  @Field(type => Boolean)
  @Column({ unsigned: true, width: 1 })
  hit!: boolean;

  @Field(type => Boolean)
  @Column({ unsigned: true, width: 1 })
  out!: boolean;

  @Field(type => Boolean)
  @Column({ unsigned: true, width: 1 })
  onTarget!: boolean;

  @Field(type => ShotType)
  @ManyToOne(type => ShotType, shotType => shotType.shots, {
    nullable: false,
    eager: true,
  })
  type!: ShotType;

  @Field(type => Int)
  @Column({ unsigned: true })
  typeId!: number;

  @Field(type => Game)
  @ManyToOne(type => Game, game => game.shots, {
    nullable: false,
  })
  game!: Game;

  @Field(type => Int)
  @Column({ unsigned: true })
  gameId!: number;

  @Field(type => Player)
  @ManyToOne(type => Player, player => player.shots, {
    nullable: false,
  })
  player!: Promise<Player>;

  @Field(type => Int)
  @Column({ unsigned: true })
  playerId!: number;

  @Field(type => Team)
  @ManyToOne(type => Team, team => team.shots, {
    nullable: false,
  })
  team!: Promise<Team>;

  @Field(type => Int)
  @Column({ unsigned: true })
  teamId!: number;

  @Field(type => Int)
  @Column({ unsigned: true, type: 'tinyint' })
  x!: number;

  @Field(type => Int)
  @Column({ unsigned: true, type: 'tinyint' })
  y!: number;
}
