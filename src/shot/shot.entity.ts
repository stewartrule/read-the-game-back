import { Field, ID, Int, ObjectType } from 'type-graphql';
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
import { PlayerAction } from '../types';

@Entity({ orderBy: { happenedAt: 'ASC' } })
@ObjectType()
export class Shot implements PlayerAction {
  @Field(type => ID)
  @PrimaryGeneratedColumn({ unsigned: true })
  id!: number;

  @Field(type => Date)
  @Column()
  happenedAt!: Date;

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
  @ManyToOne(
    type => ShotType,
    shotType => shotType.shots,
    {
      nullable: false,
      eager: true,
    },
  )
  shotType!: ShotType;

  @Field(type => Int)
  @Column({ unsigned: true })
  shotTypeId!: number;

  @Field(type => Game)
  @ManyToOne(
    type => Game,
    game => game.shots,
    {
      nullable: false,
    },
  )
  game!: Game;

  @Field(type => Int)
  @Column({ unsigned: true })
  gameId!: number;

  @Field(type => Player)
  @ManyToOne(
    type => Player,
    player => player.shots,
    {
      nullable: false,
    },
  )
  fromPlayer!: Promise<Player>;

  @Field(type => Int)
  @Column({ unsigned: true })
  fromPlayerId!: number;

  @Field(type => Team)
  @ManyToOne(
    type => Team,
    team => team.shots,
    {
      nullable: false,
    },
  )
  fromTeam!: Promise<Team>;

  @Field(type => Int)
  @Column({ unsigned: true })
  fromTeamId!: number;

  @Field(type => Int)
  @Column({ unsigned: true, type: 'tinyint' })
  x!: number;

  @Field(type => Int)
  @Column({ unsigned: true, type: 'tinyint' })
  y!: number;
}
