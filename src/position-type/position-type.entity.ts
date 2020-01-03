import { Field, ID, ObjectType } from 'type-graphql';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Player } from '../player/player.entity';
import { Position } from '../position/position.entity';

export type PositionTypeName =
  | 'goalkeeper'
  | 'defender'
  | 'midfielder'
  | 'forward';

@Entity({ orderBy: { name: 'ASC' } })
@ObjectType()
export class PositionType {
  @Field(type => ID)
  @PrimaryGeneratedColumn({ unsigned: true })
  id!: number;

  @Field()
  @Column()
  name!: PositionTypeName;

  @Field(type => [Position])
  @OneToMany(
    type => Position,
    position => position.positionType,
  )
  positions!: Position[];

  @Field(type => [Player])
  @OneToMany(
    type => Player,
    player => player.playerType,
  )
  players!: Player[];
}
