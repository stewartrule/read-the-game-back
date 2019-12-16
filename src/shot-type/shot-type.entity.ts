import { Field, ID, ObjectType } from 'type-graphql';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Shot } from '../shot/shot.entity';

@Entity()
@ObjectType()
export class ShotType {
  @Field(type => ID)
  @PrimaryGeneratedColumn({ unsigned: true })
  id!: number;

  @Field()
  @Column()
  name!: string;

  @Field(type => [Shot])
  @OneToMany(type => Shot, shot => shot.type)
  shots!: Shot[];
}
