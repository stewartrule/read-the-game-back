import { Field, ID, Int, ObjectType } from 'type-graphql';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Game } from '../game/game.entity';
import { Player } from '../player/player.entity';
import { PositionType } from '../position-type/position-type.entity';
import { Team } from '../team/team.entity';

@Entity()
@ObjectType()
export class Position {
  @Field(type => ID)
  @PrimaryGeneratedColumn({ unsigned: true })
  id!: number;

  @Field(type => PositionType)
  @ManyToOne(
    type => PositionType,
    positionType => positionType.positions,
    {
      nullable: false,
    },
  )
  positionType!: PositionType;

  @Field(type => Int)
  @Column({ unsigned: true })
  positionTypeId!: number;

  @Field(type => Player)
  @ManyToOne(
    type => Player,
    player => player.positions,
    {
      nullable: false,
    },
  )
  player!: Player;

  @Field(type => Int)
  @Column({ unsigned: true })
  playerId!: number;

  @Field(type => Team)
  @ManyToOne(
    type => Team,
    team => team.positions,
    {
      nullable: false,
    },
  )
  team!: Team;

  @Field(type => Int)
  @Column({ unsigned: true })
  teamId!: number;

  @Field(type => Game)
  @ManyToOne(
    type => Game,
    game => game.positions,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  game!: Game;

  @Field()
  @Column({ nullable: false })
  startedAt!: Date;

  @Field()
  @Column({ nullable: false })
  endedAt!: Date;
}
