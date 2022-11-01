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
  @ManyToOne(
    type => Game,
    game => game.intercepts,
  )
  game!: Game;

  @Field(type => Int)
  @Column({ unsigned: true })
  gameId!: number;

  @Field(type => Player)
  @ManyToOne(
    type => Player,
    player => player.ballLosses,
  )
  fromPlayer!: Player;

  @Field(type => Int)
  @Column({ unsigned: true })
  fromPlayerId!: number;

  @Field(type => Team)
  @ManyToOne(
    type => Team,
    team => team.ballLosses,
  )
  fromTeam!: Team;

  @Field(type => Int)
  @Column({ unsigned: true })
  fromTeamId!: number;

  @Field(type => Player)
  @ManyToOne(
    type => Player,
    player => player.intercepts,
  )
  toPlayer!: Player;

  @Field(type => Int)
  @Column({ unsigned: true })
  toPlayerId!: number;

  @Field(type => Team)
  @ManyToOne(
    type => Team,
    team => team.intercepts,
  )
  toTeam!: Team;

  @Field(type => Int)
  @Column({ unsigned: true })
  toTeamId!: number;

  @Field(type => Int)
  @Column({ unsigned: true, type: 'smallint' })
  x!: number;

  @Field(type => Int)
  @Column({ unsigned: true, type: 'smallint' })
  y!: number;
}
