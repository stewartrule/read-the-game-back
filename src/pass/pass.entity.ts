import { Field, ID, Int, ObjectType } from 'type-graphql';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Game } from '../game/game.entity';
import { PassType } from '../pass-type/pass-type.entity';
import { Player } from '../player/player.entity';
import { Team } from '../team/team.entity';

@Entity({ orderBy: { time: 'ASC' } })
@ObjectType()
export class Pass {
  @Field(type => ID)
  @PrimaryGeneratedColumn({ unsigned: true })
  id!: number;

  @Field(type => Date)
  @Column()
  time!: Date;

  @Field(type => PassType)
  @ManyToOne(type => PassType, passType => passType.passes, {
    nullable: false,
  })
  type!: PassType;

  @Field(type => Game)
  @ManyToOne(type => Game, game => game.passes)
  game!: Game;

  @Field(type => Int)
  @Column({ unsigned: true })
  gameId!: number;

  @Field(type => Team)
  @ManyToOne(type => Team, team => team.passes)
  team!: Team;

  @Field(type => Int)
  @Column({ unsigned: true })
  teamId!: number;

  @Field(type => Player)
  @ManyToOne(type => Player, player => player.passes)
  player!: Player;

  @Field(type => Int)
  @Column({ unsigned: true })
  playerId!: number;

  @Field(type => Int)
  @Column({ unsigned: true, type: 'tinyint' })
  x!: number;

  @Field(type => Int)
  @Column({ unsigned: true, type: 'tinyint' })
  y!: number;
}
